"use client";

import React, { useState } from "react";

type SummaryMap = Record<string, string>;

export default function ResearchSummarizer() {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [summaries, setSummaries] = useState<SummaryMap | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Citation generator states
  const [citationTitle, setCitationTitle] = useState<string>("");
  const [citationAuthor, setCitationAuthor] = useState<string>("");
  const [citationDate, setCitationDate] = useState<string>("");
  const [citationStyle, setCitationStyle] = useState<string>("APA");
  const [citationResult, setCitationResult] = useState<string>("");

  // Safe file handler (e.target.files can be null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setText(""); // clear text input when file chosen
  };

  // Citation formatting logic
  const formatCitation = () => {
    const author = citationAuthor.trim();
    const title = citationTitle.trim();
    const date = citationDate.trim();
    if (!author || !title || !date) {
      setCitationResult("Please fill in all fields.");
      return;
    }
    let result = "";
    switch (citationStyle) {
      case "APA":
        // APA: Author. (Year). Title.
        result = `${author}. (${date}). ${title}.`;
        break;
      case "MLA":
        // MLA: Author. "Title." Year.
        result = `${author}. \"${title}.\" ${date}.`;
        break;
      case "IEEE":
        // IEEE: Author, "Title," Year.
        result = `${author}, \"${title},\" ${date}.`;
        break;
      default:
        result = "Unknown style.";
    }
    setCitationResult(result);
  };

  // Submit either text or file to the Flask backend
  const handleSubmit = async () => {
    setError(null);
    setSummaries(null);

    if (!file && !text.trim()) {
      setError("Please provide paper text or upload a PDF file.");
      return;
    }

    setLoading(true);

    try {
      let res: Response;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        res = await fetch("http://127.0.0.1:8000/summarize", {
          method: "POST",
          body: fd,
          cache: "no-store",
        });
      } else {
        res = await fetch("http://127.0.0.1:8000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }

      if (!res.ok) {
        const textBody = await res.text();
        throw new Error(`Server error ${res.status}: ${textBody}`);
      }

      // Expecting an object mapping section-title -> string
      const data = await res.json();

      // Defensive normalization: coerce values to strings and provide fallback
      const normalized: SummaryMap = {};
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([k, v]) => {
          let value = "";
          if (v === null || typeof v === "undefined") value = "";
          else if (typeof v === "string") value = v;
          else value = String(v);
          // sensible fallback if backend left it empty
          normalized[k] =
            value.trim() && value.toLowerCase() !== "unknown"
              ? value.trim()
              : "Section not found or too short for summarization.";
        });
      }

      setSummaries(normalized);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setFile(null);
    setSummaries(null);
    setError(null);
  };

  // Always show these key sections as cards
  const keySections = [
    "Abstract",
    "Introduction",
    "Methodology",
    "Results",
    "Conclusion",
  ];

  // Helper to get summary for a section or fallback
  const getSectionSummary = (section: string) => {
    if (summaries && summaries[section]) {
      return summaries[section];
    }
    // Try alternate section names for Methodology/Results/Conclusion
    if (summaries) {
      if (section === "Methodology") {
        if (summaries["Methods"]) return summaries["Methods"];
        if (summaries["Method"]) return summaries["Method"];
      }
      if (section === "Results") {
        if (summaries["Result"]) return summaries["Result"];
      }
      if (section === "Conclusion") {
        if (summaries["Conclusions"]) return summaries["Conclusions"];
      }
    }
    return "Section not found or too short for summarization.";
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Research Paper Summarizer</h1>

      {/* Summarizer UI ...existing code... */}
      <div className="space-y-4">
        {/* ...existing code... */}
        <label className="block">
          <span className="text-sm font-medium">Paste paper text</span>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value) setFile(null); // prefer text if typed
            }}
            rows={8}
            className="mt-2 w-full p-3 border rounded"
            placeholder="Paste full paper text (or upload a PDF below)..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Or upload PDF</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-2"
          />
          {file && <div className="text-sm mt-1">Selected: {file.name}</div>}
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          <button
            onClick={clearAll}
            className="px-4 py-2 border rounded"
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Citation Generator UI */}
      <hr className="my-6" />
      <div className="space-y-4 p-4 border rounded bg-white-50">
        <h2 className="text-xl font-semibold mb-2">Citation Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Title</span>
            <input
              type="text"
              value={citationTitle}
              onChange={(e) => setCitationTitle(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
              placeholder="Paper Title"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Author(s)</span>
            <input
              type="text"
              value={citationAuthor}
              onChange={(e) => setCitationAuthor(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
              placeholder="Author(s)"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Year</span>
            <input
              type="text"
              value={citationDate}
              onChange={(e) => setCitationDate(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
              placeholder="Year (e.g. 2023)"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Style</span>
            <select
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value)}
              className="mt-2 w-full p-2 border rounded"
            >
              <option value="APA">APA 7th Edition</option>
              <option value="MLA">MLA</option>
              <option value="IEEE">IEEE</option>
            </select>
          </label>
        </div>
        <button
          onClick={formatCitation}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Generate Citation
        </button>
        {citationResult && (
          <div className="mt-2 p-3 bg-black border rounded text-white-800">
            {citationResult}
          </div>
        )}
      </div>

      {/* Summaries output ...existing code... */}
      <hr className="my-6" />
      <div className="space-y-4">
        {/* Show Keywords card if present */}
        {summaries && summaries["Keywords"] && (
          <div className="p-4 border rounded bg-yellow-50">
            <h2 className="font-semibold text-green-700">Keywords</h2>
            <p className="mt-2 text-black whitespace-pre-line">{summaries["Keywords"]}</p>
          </div>
        )}
        {keySections.map((section) => (
          <div key={section} className="p-4 border rounded">
            <h2 className="font-semibold text-blue-700">{section}</h2>
            <p className="mt-2 text-white-800 whitespace-pre-line">{getSectionSummary(section)}</p>
          </div>
        ))}
        {/* Show any other sections returned by backend that aren't in keySections or Keywords */}
        {summaries && Object.keys(summaries)
          .filter((section) => !keySections.includes(section) && section !== "Keywords")
          .map((section) => (
            <div key={section} className="p-4 border rounded">
              <h2 className="font-semibold text-blue-700">{section}</h2>
              <p className="mt-2 text-white-800 whitespace-pre-line">{summaries[section]}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
