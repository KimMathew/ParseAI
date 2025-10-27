from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import Summarizer
import re
import fitz  # PyMuPDF
from section_detector import hybrid_section_split, deep_clean_text

# Initialize Flask
app = Flask(__name__)
CORS(app)

# -------------------------------
# MODEL INITIALIZATION (global, not per request)
# -------------------------------
print("🧠 Loading summarization and embedding models...")
model = Summarizer()
print("✅ Summarizer loaded successfully!")

# -------------------------------
# HELPER FUNCTIONS
# -------------------------------

def normalize_text(text):
    """Cleans and normalizes text for better processing."""
    text = text.replace('\u00ad', '')  # remove soft hyphens
    text = re.sub(r'\r\n?', '\n', text)  # normalize newlines
    text = re.sub(r'[ \t]+', ' ', text)  # normalize spaces
    return text.strip()


def clean_references(text):
    """Removes common reference or citation noise inside a section."""
    text = re.sub(
        r"(?im)\b(Review Article|Original Article|Research Article|Short Communication|"
        r"Asian J\. Res\.|Int(?:ernational)? J\.|J\. of [A-Z][A-Za-z]+|"
        r"ISSN\s*\d{3,5}-\d{3,5}|Vol\.?\s*\d+|Issue\s*\d+|No\.?\s*\d+|"
        r"Received\s*:.*|Accepted\s*:.*|©\s*\d{4}.*|Copyright\s*\d{4}.*)\b",
        "", text
    )
    text = re.sub(r"\[\s*\d+(?:\s*[-,–]\s*\d+)*\s*\]", "", text)  # [1], [2-4]
    text = re.sub(r"\([A-Z][A-Za-z]+(?: et al\.)?,?\s*\d{4}[a-z]?\)", "", text)
    text = re.sub(r"\b[A-Z][A-Za-z]+ et al\.\s*(?:;|,|and)?", "", text)
    text = re.sub(r"https?://\S+|doi:\S+", "", text)
    text = re.sub(r"(?im)^(?:\d+\.\s+)?[A-Z][A-Za-z\- ]+,.*\(\d{4}\).*", "", text)
    text = re.sub(r"(?im)^(References|Bibliography|Literature Cited|Works Cited).*", "", text)
    text = re.sub(r"\b[A-Z][A-Za-z]+;\b", "", text)
    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def extract_text_from_pdf(file_stream):
    """Extracts all text from a PDF file stream."""
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
@app.route("/summarize", methods=["POST"])
def summarize():
    """Main summarization endpoint."""
    # 1️⃣ Extract text
    if "file" in request.files:
        file = request.files["file"]
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files are supported."}), 400
        text = extract_text_from_pdf(file)
    else:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "No text or file provided."}), 400
        text = data["text"]

    # 2️⃣ Normalize for heading detection (keep structure)
    text = normalize_text(text)

    # 3️⃣ Split into sections (regex + semantic hybrid)
    sections = hybrid_section_split(text)

    # 4️⃣ Summarize each cleaned section
    summaries = {}
    for title in ["Abstract", "Introduction", "Methodology", "Results", "Conclusion"]:
        section_text = sections.get(title, "")
        section_text = deep_clean_text(section_text)   # ✅ clean *within* the section

        if len(section_text.split()) > 2000:
            section_text = " ".join(section_text.split()[:2000])

        if section_text and len(section_text.split()) > 40:
            summary = model(section_text)
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
