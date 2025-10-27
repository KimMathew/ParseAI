import re
from sentence_transformers import SentenceTransformer, util

# --------------------------------------------
# 1. Canonical Section Aliases
# --------------------------------------------
SECTION_ALIASES = {
    "Abstract": ["Abstract", "Summary"],
    "Introduction": ["Introduction", "Background", "Overview"],
    "Methodology": ["Methodology", "Methods", "Materials and Methods", "Experimental Setup"],
    "Results": ["Results", "Findings", "Results and Discussion", "Results and Findings"],
    "Conclusion": ["Conclusion", "Conclusions", "Discussion", "Conclusion and Implications"]
}

ALL_HEADINGS = [h for group in SECTION_ALIASES.values() for h in group]
ALL_HEADINGS_PATTERN = "|".join(re.escape(h) for h in ALL_HEADINGS)

# --------------------------------------------
# 2. Load Semantic Model
# --------------------------------------------
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


# --------------------------------------------
# 3. Deep Cleaning Utility
# --------------------------------------------

def remove_figure_mentions_safe(text: str) -> str:
    """
    Safely removes parenthetical figure/table mentions — including broken '(Fig.' fragments.
    Keeps other parentheses (like (GHG)).
    """
    if not text:
        return text

    # Normalize line endings
    text = re.sub(r'\r\n?', '\n', text)

    # Merge wrapped lines like:
    # “global warming”\n(Fig. 1) → “global warming” (Fig. 1)
    text = re.sub(
        r'([)"”])\s*\n\s*(\(?\s*(?:Fig(?:\.|ure)?|Table|Tab)\b)',
        r'\1 \2',
        text,
        flags=re.I,
    )

    # Remove complete parenthetical mentions (Fig. 1), (Figure 2), (Table 3)
    text = re.sub(
        r'\(\s*(?:Fig(?:\.|ure)?|Table|Tab)\s*[^)]*\)',
        '',
        text,
        flags=re.I,
    )

    # 🚨 NEW: remove dangling or broken fragments like "(Fig.", "(Fig", "(Fig. 1" at line ends or before citation
    text = re.sub(
        r'\(\s*(?:Fig(?:\.|ure)?|Table|Tab)\b[^\n\)]{0,20}(?=$|\n|\[|[0-9]|[A-Z])',
        '',
        text,
        flags=re.I | re.M,
    )

    # Clean multiple spaces or leftover punctuation
    text = re.sub(r' +', ' ', text)
    text = re.sub(r' \.', '.', text)
    text = re.sub(r' *\n *', '\n', text)
    text = text.strip()

    return text



def deep_clean_text(text):
    """
    Robust cleaning for PDF-extracted academic text.
    Handles line breaks, references, hyphens, citations, etc.
    """

    # --- Normalize line breaks and hyphens ---
    text = text.replace('\u00ad', '')  # soft hyphens
    text = re.sub(r'-\s*\n\s*', '', text)  # join hyphenated line breaks
    text = re.sub(r'\n{2,}', '<PARA>', text)  # mark paragraphs
    text = re.sub(r'\n+', ' ', text)  # join wrapped lines
    text = text.replace('<PARA>', '\n\n')

    # --- Remove "References", "Competing Interests", etc. and everything after ---
    text = re.split(r'(?i)\b(References|Bibliography|Competing Interests|Acknowledg?ments)\b', text)[0]

    # --- Remove inline numeric citations ---
    text = re.sub(r"\[\s*\d+(?:\s*[-,–]\s*\d+)*\s*\]", "", text)

    # --- Remove author-year style citations ---
    text = re.sub(r"\([A-Z][A-Za-z]+(?: et al\.)?,?\s*\d{4}[a-z]?\)", "", text)

    # --- Remove standalone author lists / reference-style lines ---
    text = re.sub(r"(?im)^(?:\d+\.\s+)?[A-Z][A-Za-z\- ]+,.*\(\d{4}\).*", "", text)

    # --- Remove excessive spaces and punctuation noise ---
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r"\s*([,;:.])\s*", r"\1 ", text)
    text = re.sub(r"\s*\.\s*\.", ".", text)

    # --- Fix capitalization after periods (optional cosmetic) ---
    text = re.sub(r'(?<=\.\s)([a-z])', lambda m: m.group(1).upper(), text)

    return text.strip()


# --------------------------------------------
# 4. Regex Section Detection
# --------------------------------------------
def detect_headings_regex(text):
    """
    Regex-based heading detection (first pass)
    Strictly matches real section headings, not inline words.
    """
    lines = text.splitlines()
    matches = []
    for idx, line in enumerate(lines):
        stripped = line.strip()

        # Skip if too short or too long
        if not stripped or len(stripped.split()) > 8:
            continue

        # Skip if it's part of a paragraph (ends with lowercase or punctuation)
        if re.search(r"[.!?,;]$", stripped):
            continue

        # Must be title-like: either ALL CAPS or Title Case with known keywords
        if not (stripped.isupper() or stripped.istitle()):
            continue

        # Check if line matches known section headers (case-insensitive)
        for canonical, variants in SECTION_ALIASES.items():
            for v in variants:
                # Allow optional numbering (1., I., etc.) before heading
                if re.fullmatch(rf"(?:\d+[\.\)]\s*)?(?:[IVX]+\.\s*)?{v}", stripped, flags=re.I):
                    match_start = text.find(line)
                    match_end = match_start + len(line)
                    matches.append({
                        "name": canonical,
                        "match": v,
                        "start": match_start,
                        "end": match_end
                    })
                    break
    return matches



# --------------------------------------------
# 5. Generic Heading Detector (prevents leakage)
# --------------------------------------------
def looks_like_heading(line: str) -> bool:
    """
    Detects lines that look like section headings (ALL CAPS, short, no punctuation).
    Used to cut off sections at unexpected subheadings.
    """
    line = line.strip()
    if not line:
        return False
    if len(line.split()) > 12:  # too long for a heading
        return False
    if not line.isupper():
        return False
    if re.search(r"[.!?,;:]", line):
        return False
    if re.match(r"^(TABLE|FIGURE|APPENDIX|REFERENCE|ACKNOWLEDG)", line):
        return True  # definitely a break
    # Must contain at least one alphabetic word
    return bool(re.search(r"[A-Z]{3,}", line))


# --------------------------------------------
# 6. Semantic Fallback
# --------------------------------------------
def semantic_section_inference(paragraphs):
    """
    Fallback: infer likely section type for each paragraph semantically.
    """
    section_prompts = list(SECTION_ALIASES.keys())
    section_embs = embedding_model.encode(section_prompts, convert_to_tensor=True)

    paragraph_sections = []
    for p in paragraphs:
        p_emb = embedding_model.encode(p, convert_to_tensor=True)
        similarities = util.cos_sim(p_emb, section_embs)[0]
        best_idx = int(similarities.argmax())
        section_name = section_prompts[best_idx]
        paragraph_sections.append(section_name)
    return paragraph_sections


# --------------------------------------------
# 7. Hybrid Section Split (Regex + Semantic)
# --------------------------------------------
def hybrid_section_split(text):
    """
    Combines regex and semantic inference to robustly split sections.
    Detects major headings via regex, and cuts off early at any unknown ALL CAPS subheading.
    """
    # Normalize
    text = re.sub(r'\r\n?', '\n', text)
    text = remove_figure_mentions_safe(text)
    paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 30]

    # Try regex first
    regex_hits = detect_headings_regex(text)

    if regex_hits:
        sections = {}
        for i, h in enumerate(regex_hits):
            next_start = regex_hits[i + 1]["start"] if i + 1 < len(regex_hits) else len(text)
            section_chunk = text[h["end"]:next_start]

            # 🧠 Early cutoff: stop when encountering a generic heading-like line
            lines = section_chunk.splitlines()
            clean_lines = []
            for ln in lines:
                if looks_like_heading(ln):
                    print(f"⚠️ Early stop at generic heading: {ln[:80]}")
                    break
                clean_lines.append(ln)
            section_text = "\n".join(clean_lines).strip()

            sections[h["name"]] = section_text
        return sections

    # Fallback: semantic classification
    if not paragraphs:
        return {}

    semantic_labels = semantic_section_inference(paragraphs)

    # Merge consecutive paragraphs with same inferred label
    sections = {}
    current_label = semantic_labels[0]
    buffer = []
    for label, para in zip(semantic_labels, paragraphs):
        if label != current_label:
            sections[current_label] = "\n\n".join(buffer)
            buffer = [para]
            current_label = label
        else:
            buffer.append(para)
    sections[current_label] = "\n\n".join(buffer)

    return sections
