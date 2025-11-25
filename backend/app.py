from langchain_ollama import ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_transformers import EmbeddingsClusteringFilter
from langchain_huggingface import HuggingFaceEmbeddings


####################
# Code by Debugverse
# https://www.youtube.com/@DebugVerseTutorials
####################


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
        # Combine all text into one string for section splitting
        full_text = "\n".join([doc.page_content for doc in result])

        # Heuristic: Split by common section headers (case-insensitive)
        import re
        section_pattern = re.compile(r"^(abstract|introduction|background|methods?|methodology|results?|discussion|conclusion|references?)\b", re.IGNORECASE | re.MULTILINE)
        # Find all section headers and their positions
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
            # Fallback: treat whole text as one section
            sections["Full Document"] = full_text

        # Summarize each section
        summaries = {}
        for section, content in sections.items():
            prompt = f"Summarize the {section} section of this research paper:\n{content}"
            try:
                summary = llm.invoke(prompt)
            except Exception as e:
                summary = f"Error summarizing section: {str(e)}"
            summaries[section] = summary
        return summaries
    except Exception as e:
        return {"error": str(e)}
    

model_name = "BAAI/bge-base-en-v1.5"
model_kwargs = {"device": "cuda"} # CUDA for GPU support
encode_kwargs = {"normalize_embeddings": True}

embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

llm = ChatOllama( # Replace with LLM of your choice
    model="llama3.1:latest",
    temperature=0
)

