"use client";

import React, { useState } from "react";

type SummaryMap = Record<string, string>;

export default function ResearchSummarizer() {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [summaries, setSummaries] = useState<SummaryMap | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Safe file handler (e.target.files can be null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setText(""); // clear text input when file chosen
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Research Paper Summarizer</h1>

      <div className="space-y-4">
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

      <hr className="my-6" />

      {summaries ? (
        <div className="space-y-4">
          {Object.entries(summaries).map(([section, content]) => (
            <div key={section} className="p-4 border rounded">
              <h2 className="font-semibold text-blue-700">{section}</h2>
              <p className="mt-2 text-white-800 whitespace-pre-line">{content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No summary yet.</div>
      )}
    </div>
  );
}
