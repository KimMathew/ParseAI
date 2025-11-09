from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import pathlib
env_local_path = pathlib.Path(__file__).parent.parent / '.env.local'
env_path = pathlib.Path(__file__).parent.parent / '.env'
if env_local_path.exists():
    load_dotenv(dotenv_path=env_local_path)
    print(f"[DEBUG] Loaded .env.local from: {env_local_path}")
else:
    load_dotenv(dotenv_path=env_path)
    print(f"[DEBUG] Loaded .env from: {env_path}")
print(f"[DEBUG] SUPABASE_URL: {os.environ.get('NEXT_PUBLIC_SUPABASE_URL')}")
print(f"[DEBUG] SUPABASE_SERVICE_KEY: {os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')}")
from langchain_ollama import ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_transformers import EmbeddingsClusteringFilter
from langchain_huggingface import HuggingFaceEmbeddings
import re

# KeyBERT imports
from keybert import KeyBERT
import torch

app = Flask(__name__)
CORS(app, supports_credentials=True)

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
            "Do NOT use bullet points, numbered lists, or any introductory comments. Use simple words to explain the content to a non-IT person. "
            
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
            # --- Keyword Extraction ---
            # 1. Try to extract stated keywords from the text
            keyword_pattern = re.compile(r"keywords?\s*[:\-]\s*(.+?)(?:\n|$)", re.IGNORECASE)
            keyword_match = keyword_pattern.search(full_text)
            if keyword_match:
                # Use the stated keywords (split by comma or semicolon)
                stated_keywords = keyword_match.group(1)
                keywords = [k.strip() for k in re.split(r",|;", stated_keywords) if k.strip()]
                summaries["Keywords"] = ", ".join(keywords)
            else:
                # 2. Use KeyBERT to extract keywords from the text
                try:
                    # Use only the first 2000 characters for speed
                    text_for_kw = full_text[:2000] if len(full_text) > 2000 else full_text
                    kw_model = KeyBERT()
                    keybert_keywords = kw_model.extract_keywords(text_for_kw, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=8)
                    keywords = [kw for kw, score in keybert_keywords]
                    summaries["Keywords"] = ", ".join(keywords)
                except Exception as e:
                    summaries["Keywords"] = f"Error extracting keywords: {str(e)}"
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


# --- Q&A Endpoint for Chat ---
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    document_id = data.get('document_id')
    question = data.get('question')
    if not document_id or not question:
        return jsonify({'error': 'Missing document_id or question'}), 400

    # --- Supabase client setup ---
    import supabase
    from supabase import create_client
    SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_KEY')
    if not SUPABASE_URL or not SUPABASE_KEY:
        return jsonify({'error': 'Supabase credentials not set in environment'}), 500
    supa = create_client(SUPABASE_URL, SUPABASE_KEY)

    # --- Fetch document record ---
    doc_resp = supa.table('documents').select('*').eq('id', document_id).single().execute()
    doc = doc_resp.data if hasattr(doc_resp, 'data') else doc_resp.get('data')
    if not doc:
        return jsonify({'error': 'Document not found in database'}), 404

    file_url = doc.get('file_url')
    file_type = doc.get('file_type')
    original_text = doc.get('original_text')

    import tempfile
    temp_path = None
    full_text = None
    try:
        if file_url and file_type in ('pdf', 'docx'):
            # Download file from Supabase Storage
            # file_url is like 'user_id/timestamp_filename.pdf'
            bucket = 'documents'
            file_path = file_url
            file_data = supa.storage.from_(bucket).download(file_path)
            # Save to temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf' if file_type=='pdf' else '.docx') as temp:
                temp.write(file_data)
                temp_path = temp.name
            # Extract clustered/filtered text
            filter = EmbeddingsClusteringFilter(embeddings=embeddings, num_clusters=10)
            texts = extract(temp_path)
            result = filter.transform_documents(documents=texts)
            full_text = "\n".join([doc.page_content for doc in result])
        elif original_text:
            # Use original_text (for pasted text)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.txt', mode='w', encoding='utf-8') as temp:
                temp.write(original_text)
                temp_path = temp.name
            filter = EmbeddingsClusteringFilter(embeddings=embeddings, num_clusters=10)
            texts = extract(temp_path)
            result = filter.transform_documents(documents=texts)
            full_text = "\n".join([doc.page_content for doc in result])
        else:
            return jsonify({'error': 'No file or text found for this document.'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to extract document text: {str(e)}'}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

    # --- Compose prompt for Ollama ---
    prompt = (
        f"This is the text of a research paper:\n{full_text}\n"
        f"Answer the following question based ONLY on the above paper.\n"
        f"Question: {question}\n"
        f"Answer in a clear, concise way for a non-technical reader."
    )
    try:
        response = llm.invoke(prompt)
        if hasattr(response, 'content'):
            response = response.content
        answer = response.strip()
    except Exception as e:
        return jsonify({'error': f'LLM error: {str(e)}'}), 500

    return jsonify({'answer': answer})

# --- Per-document Chat Endpoints ---
from datetime import datetime

# POST /chat: Ask a question, get answer, save both
@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        # CORS preflight
        return ('', 204)
    data = request.get_json()
    user_id = data.get('user_id')
    document_id = data.get('document_id')
    question = data.get('question')
    if not user_id or not document_id or not question:
        return jsonify({'error': 'Missing user_id, document_id, or question'}), 400

    # Use the same logic as /ask to get the answer
    # --- Supabase client setup ---
    import supabase
    from supabase import create_client
    SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_KEY')
    if not SUPABASE_URL or not SUPABASE_KEY:
        return jsonify({'error': 'Supabase credentials not set in environment'}), 500
    supa = create_client(SUPABASE_URL, SUPABASE_KEY)

    # --- Fetch document record ---
    doc_resp = supa.table('documents').select('*').eq('id', document_id).single().execute()
    doc = doc_resp.data if hasattr(doc_resp, 'data') else doc_resp.get('data')
    if not doc:
        return jsonify({'error': 'Document not found in database'}), 404

    file_url = doc.get('file_url')
    file_type = doc.get('file_type')
    original_text = doc.get('original_text')

    import tempfile
    temp_path = None
    full_text = None
    try:
        if file_url and file_type in ('pdf', 'docx'):
            bucket = 'documents'
            file_path = file_url
            file_data = supa.storage.from_(bucket).download(file_path)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf' if file_type=='pdf' else '.docx') as temp:
                temp.write(file_data)
                temp_path = temp.name
            filter = EmbeddingsClusteringFilter(embeddings=embeddings, num_clusters=10)
            texts = extract(temp_path)
            result = filter.transform_documents(documents=texts)
            full_text = "\n".join([doc.page_content for doc in result])
        elif original_text:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.txt', mode='w', encoding='utf-8') as temp:
                temp.write(original_text)
                temp_path = temp.name
            filter = EmbeddingsClusteringFilter(embeddings=embeddings, num_clusters=10)
            texts = extract(temp_path)
            result = filter.transform_documents(documents=texts)
            full_text = "\n".join([doc.page_content for doc in result])
        else:
            return jsonify({'error': 'No file or text found for this document.'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to extract document text: {str(e)}'}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

    # --- Compose prompt for Ollama ---
    prompt = (
        f"This is the text of a research paper:\n{full_text}\n"
        f"Answer the following question based ONLY on the above paper.\n"
        f"Question: {question}\n"
        f"Answer in a clear, concise way for a non-technical reader."
    )
    try:
        response = llm.invoke(prompt)
        if hasattr(response, 'content'):
            response = response.content
        answer = response.strip()
    except Exception as e:
        return jsonify({'error': f'LLM error: {str(e)}'}), 500

    # --- Save chat to Supabase ---
    chat_data = {
        'user_id': user_id,
        'document_id': document_id,
        'question': question,
        'answer': answer,
        'created_at': datetime.utcnow().isoformat() + 'Z',
    }
    supa.table('chats').insert(chat_data).execute()

    return jsonify({'answer': answer})

# GET /chat/<document_id>: Get all chat messages for a document
@app.route('/chat/<document_id>', methods=['GET'])
def get_chat(document_id):
    import supabase
    from supabase import create_client
    SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_KEY')
    if not SUPABASE_URL or not SUPABASE_KEY:
        return jsonify({'error': 'Supabase credentials not set in environment'}), 500
    supa = create_client(SUPABASE_URL, SUPABASE_KEY)
    resp = supa.table('chats').select('*').eq('document_id', document_id).order('created_at', desc=False).execute()
    chats = resp.data if hasattr(resp, 'data') else resp.get('data')
    return jsonify({'chats': chats or []})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)