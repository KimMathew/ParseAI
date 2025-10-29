from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain_ollama import ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_transformers import EmbeddingsClusteringFilter
from langchain_huggingface import HuggingFaceEmbeddings
import re

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
        key_sections = ["Abstract", "Introduction", "Methodology", "Results", "Conclusion"]
        prompt = (
            f"This is the text:\n{full_text}"
            "For the research paper text above, extract and summarize ONLY the following sections: "
            "Abstract, Introduction, Methodology, Results, Conclusion. "
            "If a section is not present, do NOT mention it at all. Don't include any other sections. "
            "For each section found, output the section name as a markdown heading with double asterisks (e.g., **Section**) followed by its summary as a single paragraph. "
            "Do NOT use bullet points, numbered lists, or any introductory comments. "
            
        )
        print("[DEBUG] LLM Prompt:\n", prompt[:1000], "..." if len(prompt) > 1000 else "")
        try:
            response = llm.invoke(prompt)
            print("[DEBUG] LLM Raw Response:\n", response)
            if hasattr(response, 'content'):
                response = response.content
            # Extract sections using double asterisk markdown headings
            summaries = {}
            for section in key_sections:
                pattern = re.compile(rf"\*\*{section}\*\*\s*\n+(.*?)(?=\n\*\*|\Z)", re.IGNORECASE | re.DOTALL)
                match = pattern.search(response)
                if match:
                    raw_summary = match.group(1).strip()
                    # Remove numbered points (e.g., 1. ... 2. ...)
                    paragraph = re.sub(r"\n?\d+\.\s+\*\*.*?\*\*:?\s*", " ", raw_summary)
                    paragraph = re.sub(r"\n?\d+\.\s+", " ", paragraph)
                    # Remove extra newlines and join lines
                    paragraph = " ".join(paragraph.splitlines())
                    # Remove references leaking into conclusion
                    if section == "Conclusion":
                        # Remove everything after 'References:' or 'References\n'
                        paragraph = re.split(r"references:?\s*", paragraph, flags=re.IGNORECASE)[0].strip()
                    summaries[section] = paragraph.strip()
            print("[DEBUG] Parsed JSON from markdown headings (post-processed):\n", summaries)
        except Exception as e:
            print("[ERROR] LLM invocation failed:\n", e)
            summaries = {"error": f"Error extracting sections: {str(e)}"}
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
