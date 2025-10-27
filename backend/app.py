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

def find_all_headings(text):
    """
    Return a list of heading dicts found in the text.
    Each dict: {'name': heading_name, 'start': match_start, 'end': match_end}
    The regex matches headings that appear on their own line, optionally numbered.
    """
    # Possible headings to detect — expand if needed
    all_headings = [
        "Abstract", "Introduction", "Background", "Literature Review",
        "Methodology", "Methods", "Materials and Methods",
        "Results", "Findings", "Results and Discussion", "Results and Findings",
        "Discussion", "Conclusion", "Conclusions", "Conclusion and Implications",
        "Recommendations", "Acknowledgements", "References", "Bibliography", "Appendix"
    ]
    all_headings_re = "|".join([re.escape(h) for h in all_headings])

    # Match headings that appear on their own line (optionally '1.' numbering)
    # Capture the canonical heading name in group(1)
    pattern = rf'(?im)^[ \t]*\d{{0,2}}\.?\s*({all_headings_re})[ \t]*(?:[:\-–].*)?$'

    headings = []
    for m in re.finditer(pattern, text):
        name = m.group(1).strip()
        headings.append({
            "name": name,
            "start": m.start(),
            "end": m.end()
        })
    return headings


def extract_section(text, pattern):
    """
    Extract a section by:
      1) finding all headings that appear as standalone lines
      2) locating the heading whose name matches `pattern` (pattern can be a regex)
      3) returning the substring between that heading.end and the next heading.start
    """
    # Normalize a little to make heading detection more reliable
    clean_text = re.sub(r'\r\n?', '\n', text)            # normalize newlines
    clean_text = clean_text.replace('\u00ad', '')       # remove soft hyphens
    # don't aggressively join lines here — we normalize inside clean_references later

    # Find headings and their positions
    headings = find_all_headings(clean_text)

    if not headings:
        print("❌ No headings detected at all")
        return ""

    # Find a heading that matches the requested pattern.
    # pattern parameter is the same string you're currently using (may contain pipes).
    match_index = None
    for i, h in enumerate(headings):
        # match heading name against the pattern (case-insensitive)
        try:
            if re.search(pattern, h["name"], flags=re.IGNORECASE):
                match_index = i
                break
        except re.error:
            # If pattern is not a valid regex (unlikely), fall back to substring
            if pattern.lower() in h["name"].lower():
                match_index = i
                break

    if match_index is None:
        print(f"❌ No match for {pattern}")
        return ""

    start_pos = headings[match_index]["end"]
    end_pos = headings[match_index + 1]["start"] if (match_index + 1) < len(headings) else len(clean_text)

    extracted = clean_text[start_pos:end_pos].strip()
    extracted = clean_references(extracted)   # cleans citations and normalizes newlines
    print(f"✅ Found section for {pattern}: {len(extracted)} chars")
    return extracted.strip()


def clean_references(text):
    """Removes common reference or citation noise inside a section."""

    # Remove journal header/footer artifacts
    text = re.sub(
        r"(?im)\b(Review Article|Original Article|Research Article|Short Communication|"
        r"Asian J\. Res\.|Int(?:ernational)? J\.|J\. of [A-Z][A-Za-z]+|"
        r"ISSN\s*\d{3,5}-\d{3,5}|Vol\.?\s*\d+|Issue\s*\d+|No\.?\s*\d+|"
        r"Received\s*:.*|Accepted\s*:.*|©\s*\d{4}.*|Copyright\s*\d{4}.*)\b",
        "", 
        text
    )
    # Remove inline numeric citations like [1], [2,3], [12–15]
    text = re.sub(r"\[\s*\d+(?:\s*[-,–]\s*\d+)*\s*\]", "", text)

    # Remove author-year citations like (Smith, 2020), (Doe et al., 2021a)
    text = re.sub(r"\([A-Z][A-Za-z]+(?: et al\.)?,?\s*\d{4}[a-z]?\)", "", text)

    # Remove dangling or standalone author refs like "Mume et al.", "Mume et al.;", etc.
    text = re.sub(r"\b[A-Z][A-Za-z]+ et al\.\s*(?:;|,|and)?", "", text)

    # Remove multiple-author inline citations: "Mume, Smith, and Lee (2021)"
    text = re.sub(r"\b(?:[A-Z][A-Za-z]+,\s*){1,3}(?:and\s+)?[A-Z][A-Za-z]+\s*\(\d{4}\)", "", text)

    # Remove DOIs and URLs
    text = re.sub(r"https?://\S+|doi:\S+", "", text)

    # Remove lines that look like references (e.g., start with authors + year)
    text = re.sub(r"(?im)^(?:\d+\.\s+)?[A-Z][A-Za-z\- ]+,.*\(\d{4}\).*", "", text)

    # Remove leftover 'References' or similar headers
    text = re.sub(r"(?im)^(References|Bibliography|Literature Cited|Works Cited).*", "", text)

    # Remove any lingering isolated author names followed by semicolon (e.g., “Mume;”)
    text = re.sub(r"\b[A-Z][A-Za-z]+;\b", "", text)

    # Remove multiple blank lines and stray punctuation leftovers
    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"\s*[,;:]\s*(?=[,;:])", " ", text)

    text = normalize_newlines(text)

    return text.strip()

def normalize_newlines(text):
    """
    Fixes PDF-extracted line breaks:
    - Joins broken lines inside paragraphs
    - Preserves double newlines as paragraph breaks
    - Fixes hyphenated word splits
    """
    # Replace soft hyphens and hyphenated line breaks
    text = text.replace('\u00ad', '')
    text = re.sub(r'-\s*\n\s*', '', text)

    # Mark paragraph breaks (two or more newlines)
    text = re.sub(r'\n{2,}', '<PARA>', text)

    # Remove single newlines (join wrapped lines)
    text = re.sub(r'\n+', ' ', text)

    # Restore paragraph breaks
    text = text.replace('<PARA>', '\n\n')

    # Clean up redundant spaces
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\s{2,}', ' ', text)

    return text.strip()


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
