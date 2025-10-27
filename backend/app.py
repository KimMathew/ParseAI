from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import re
import fitz  # PyMuPDF
from section_detector import hybrid_section_split, deep_clean_text  # make sure your helper module is imported

# Initialize Flask
app = Flask(__name__)
CORS(app)

# -------------------------------
# MODEL INITIALIZATION (global, not per request)
# -------------------------------

print("🧠 Loading Flan-T5 summarization model...")
flan_summarizer = pipeline("summarization", model="google/flan-t5-base")
print("✅ Flan-T5 loaded successfully!")


# -------------------------------
# HELPER FUNCTIONS
# -------------------------------
def normalize_text(text: str) -> str:
    """Cleans and normalizes text for better processing."""
    text = text.replace('\u00ad', '')  # remove soft hyphens
    text = re.sub(r'\r\n?', '\n', text)  # normalize newlines
    text = re.sub(r'[ \t]+', ' ', text)  # normalize spaces
    return text.strip()


def clean_references(text: str) -> str:
    """Removes common reference/citation noise inside a section."""
    # Remove inline numeric citations [1], [2-4]
    text = re.sub(r"\[\s*\d+(?:\s*[-,–]\s*\d+)*\s*\]", "", text)
    # Remove author-year style citations (Smith et al., 2023)
    text = re.sub(r"\([A-Z][A-Za-z]+(?: et al\.)?,?\s*\d{4}[a-z]?\)", "", text)
    # Remove URLs or DOI links
    text = re.sub(r"https?://\S+|doi:\S+", "", text)
    # Remove standalone reference-style lines
    text = re.sub(r"(?im)^(?:\d+\.\s+)?[A-Z][A-Za-z\- ]+,.*\(\d{4}\).*", "", text)
    # Remove common headings like References
    text = re.sub(r"(?im)^(References|Bibliography|Literature Cited|Works Cited).*", "", text)
    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def extract_text_from_pdf(file_stream) -> str:
    """Extracts all text from a PDF file stream using PyMuPDF."""
    pdf_document = fitz.open(stream=file_stream.read(), filetype="pdf")
    text = ""
    for page in pdf_document:
        text += page.get_text("text") + "\n"
    pdf_document.close()
    return text


# -------------------------------
# API ROUTE
# -------------------------------
@app.route("/summarize", methods=["POST"])

def summarize():
    """Main summarization endpoint supporting PDF upload or JSON text."""
    text = ""

    # 1️⃣ Handle PDF upload
    if "file" in request.files:
        file = request.files["file"]
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files are supported."}), 400
        text = extract_text_from_pdf(file)

    # 2️⃣ Handle raw text input
    elif request.is_json:
        data = request.get_json()
        text = data.get("text", "")
        if not text.strip():
            return jsonify({"error": "No text provided."}), 400
    else:
        return jsonify({"error": "No text or file provided."}), 400

    # Normalize text
    text = normalize_text(text)

    # Split into sections
    sections = hybrid_section_split(text)

    # Set max_new_tokens to 512 for all summaries
    max_new_tokens = 512

    # Summarize each section
    summaries = {}
    for title in ["Abstract", "Introduction", "Methodology", "Results", "Conclusion"]:
        section_text = sections.get(title, "")
        section_text = deep_clean_text(section_text)
        section_text = clean_references(section_text)

        if len(section_text.split()) > 40:
            summary = flan_summarizer(
                section_text,
                max_new_tokens=max_new_tokens,
                do_sample=False,
            )[0]["summary_text"]
            summaries[title] = summary
        else:
            summaries[title] = "Section not found or too short for summarization."

    return jsonify(summaries)


# -------------------------------
# RUN APP
# -------------------------------
if __name__ == "__main__":
    print("🚀 Starting ParseAI Summarization API...")
    app.run(host="0.0.0.0", port=8000, debug=True)
