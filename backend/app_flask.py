from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain_ollama import ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_transformers import EmbeddingsClusteringFilter
from langchain_huggingface import HuggingFaceEmbeddings

app = Flask(__name__)
CORS(app)

model_name = "BAAI/bge-base-en-v1.5"
model_kwargs = {"device": "cpu"}
encode_kwargs = {"normalize_embeddings": True}

embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

llm = ChatOllama(
    model="llama3.1:latest",
    temperature=0
)

def extract(file_path):
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000, chunk_overlap=0
    )
    texts = text_splitter.split_documents(pages)
    return texts

def summarize_document_with_kmeans_clustering(file, llm, embeddings):
    filter = EmbeddingsClusteringFilter(embeddings=embeddings, num_clusters=10)
    texts = extract(file)
    try:
        result = filter.transform_documents(documents=texts)
        full_text = "\n".join([doc.page_content for doc in result])
        import re
        section_pattern = re.compile(r"^(abstract|introduction|background|methods?|methodology|results?|discussion|conclusion|references?)\b", re.IGNORECASE | re.MULTILINE)
        matches = list(section_pattern.finditer(full_text))
        sections = {}
        if matches:
            for i, match in enumerate(matches):
                start = match.start()
                end = matches[i+1].start() if i+1 < len(matches) else len(full_text)
                section_name = match.group(0).strip().capitalize()
                section_text = full_text[start:end].strip()
                sections[section_name] = section_text
        else:
            sections["Full Document"] = full_text
        summaries = {}
        for section, content in sections.items():
            prompt = f"Summarize the {section} section of this research paper:\n{content}"
            try:
                summary = llm.invoke(prompt)
                if hasattr(summary, 'content'):
                    summary = summary.content
                else:
                    summary = str(summary)
            except Exception as e:
                summary = f"Error summarizing section: {str(e)}"
            summaries[section] = summary
        return summaries
    except Exception as e:
        return {"error": str(e)}

@app.route('/summarize', methods=['POST'])
def summarize():
    if 'file' in request.files:
        pdf_file = request.files['file']
        file_path = os.path.join('uploads', pdf_file.filename)
        os.makedirs('uploads', exist_ok=True)
        pdf_file.save(file_path)
        result = summarize_document_with_kmeans_clustering(file_path, llm, embeddings)
        os.remove(file_path)
        return jsonify(result)
    elif request.is_json:
        data = request.get_json()
        text = data.get('text', '')
        if not text.strip():
            return jsonify({'error': 'No text provided.'}), 400
        # Simulate PDF extraction for text input
        import tempfile
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.txt', mode='w', encoding='utf-8') as temp:
                temp.write(text)
                temp_path = temp.name
            # Use the same summarization logic
            result = summarize_document_with_kmeans_clustering(temp_path, llm, embeddings)
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
        return jsonify(result)
    else:
        return jsonify({'error': 'No file or text provided.'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
