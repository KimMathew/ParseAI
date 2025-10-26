from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import Summarizer
import re
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app)

model = Summarizer()

SECTION_PATTERNS = {
    "Abstract Summary": r"Abstract",
    "Introduction Overview": r"Introduction",
    "Methodology Simplification": r"Methodology|Methods|Materials and Methods",
    "Results & Findings": r"Results|Findings|Results and Discussion|Results and Findings",
    "Conclusion & Implications": r"Conclusion|Conclusions|Discussion|Conclusion and Implications",
}


def extract_section(text, pattern):
    # Normalize text
    clean_text = re.sub(r'[\r\n]+', '\n', text)
    clean_text = re.sub(r'[ \t]+', ' ', clean_text)
    clean_text = re.sub(r'\s{2,}', ' ', clean_text)
    clean_text = clean_text.replace('\u00ad', '')  # remove soft hyphens
    clean_text = clean_text.replace('-\n', '')     # fix hyphenated words

    # Regex: match section up to next major heading or references
    regex = rf"(?i)(?:^|\n|\s)({pattern})(?:\s*[:\-–]\s*|\s+)([\s\S]*?)(?=\n(?:[A-Z][A-Za-z ]{{2,}}\s*$|References|Bibliography|Acknowledg|Appendix|\Z))"
    match = re.search(regex, clean_text)

    if match:
        extracted = match.group(2).strip()

        # Remove leftover reference or appendix lines
        extracted = re.sub(r"(?im)^(References|Bibliography|Appendix|Acknowledg).*", "", extracted)
        print(f"✅ Found section for {pattern}: {len(extracted)} chars")
        return extracted.strip()
    else:
        print(f"❌ No match for {pattern}")
        return ""


def extract_text_from_pdf(file_stream):
    """Extracts all text from a PDF file stream."""
    pdf_document = fitz.open(stream=file_stream.read(), filetype="pdf")
    text = ""
    for page in pdf_document:
        text += page.get_text("text") + "\n"
    return text


@app.route("/summarize", methods=["POST"])
def summarize():
    # Handle PDF upload
    if "file" in request.files:
        file = request.files["file"]
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files are supported."}), 400
        text = extract_text_from_pdf(file)
    else:
        # Handle raw text input
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "No text or file provided."}), 400
        text = data["text"]

    summaries = {}
    for title, pattern in SECTION_PATTERNS.items():
        section_text = extract_section(text, pattern)

        # ✅ Step 2: Clean out reference-like patterns inside sections
        section_text = re.sub(r"\[\d+\]|\([A-Za-z]+ et al\., \d{4}\)", "", section_text)

        # ✅ Step 3: Limit length for large papers
        if len(section_text.split()) > 2000:
            section_text = " ".join(section_text.split()[:2000])

        if section_text and len(section_text.split()) > 40:
            summary = model(section_text)
            summaries[title] = summary
        else:
            summaries[title] = "Section not found or too short for summarization."

    return jsonify(summaries)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)