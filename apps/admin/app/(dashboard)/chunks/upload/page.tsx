"use client";

import { useState, useRef, DragEvent } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ResultItem = { id: string; text: string; status: "ok" | "error"; error?: string };
type Mode = "paste" | "file";

export default function UploadPage() {
  const [mode, setMode] = useState<Mode>("paste");
  const [pasteText, setPasteText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Parse paste text into preview lines
  function handlePasteChange(val: string) {
    setPasteText(val);
    setPreview(val.split("\n").map(l => l.trim()).filter(l => l.length > 0));
    setResults(null);
  }

  function handleFileSelect(f: File) {
    if (!f.name.endsWith(".txt")) { setError("Only .txt files are allowed."); return; }
    setError("");
    setFile(f);
    setResults(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = (e.target?.result as string)
        .split("\n").map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith("#"));
      setPreview(lines);
    };
    reader.readAsText(f);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }

  async function handleSubmit() {
    if (preview.length === 0) { setError("Nothing to upload."); return; }
    setLoading(true); setError(""); setResults(null);

    try {
      let r: Response;
      if (mode === "paste") {
        r = await fetch(`${API}/api/chunks/bulk`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: preview }),
        });
      } else {
        const form = new FormData();
        form.append("file", file!);
        r = await fetch(`${API}/api/chunks/upload`, {
          method: "POST", credentials: "include", body: form,
        });
      }
      const json = await r.json();
      if (!r.ok) { setError(json.message || "Upload failed."); return; }
      setResults(json.data);
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }

  const succeeded = results?.filter(r => r.status === "ok").length ?? 0;
  const failed = results?.filter(r => r.status === "error").length ?? 0;

  return (
    <div style={{ padding: "32px", maxWidth: "760px" }}>
      <div style={{ marginBottom: "28px" }}>
        <a href="/chunks" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
          ← Back to Knowledge Base
        </a>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginTop: "12px", letterSpacing: "-0.02em" }}>
          Bulk Upload
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
          Add multiple chunks at once. Each line becomes one chunk.
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["paste", "file"] as Mode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); setPreview([]); setResults(null); setError(""); }} style={{
            padding: "7px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
            background: mode === m ? "var(--accent-muted)" : "var(--bg-card)",
            border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
            color: mode === m ? "var(--accent-hover)" : "var(--text-secondary)",
            cursor: "pointer",
          }}>
            {m === "paste" ? "📋 Paste Text" : "📁 Upload .txt File"}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        {/* Paste mode */}
        {mode === "paste" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Paste chunks (one per line)
            </label>
            <textarea
              value={pasteText}
              onChange={(e) => handlePasteChange(e.target.value)}
              rows={10}
              placeholder={"He has experience with Redis caching strategies.\nHe built a multi-tenant SaaS platform.\nHe loves TypeScript and clean architecture."}
              style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: "8px", padding: "12px 14px",
                color: "var(--text-primary)", fontSize: "13px",
                resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.7,
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>
        )}

        {/* File mode */}
        {mode === "file" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? "var(--accent)" : "var(--border-hover)"}`,
              borderRadius: "10px", padding: "48px 24px",
              textAlign: "center", cursor: "pointer",
              background: dragging ? "var(--accent-muted)" : "var(--bg-secondary)",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📁</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px" }}>
              {file ? file.name : "Drop your .txt file here"}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
              {file ? `${preview.length} lines detected` : "or click to browse"}
            </div>
            <input ref={fileRef} type="file" accept=".txt" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      {preview.length > 0 && !results && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Preview — {preview.length} chunk{preview.length !== 1 ? "s" : ""} to add
            </div>
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {preview.slice(0, 20).map((line, i) => (
              <div key={i} style={{
                padding: "6px 10px", background: "var(--bg-secondary)", borderRadius: "6px",
                fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.5,
              }}>
                <span style={{ color: "var(--text-muted)", marginRight: "8px" }}>#{i + 1}</span>
                {line}
              </div>
            ))}
            {preview.length > 20 && (
              <div style={{ color: "var(--text-muted)", fontSize: "12px", padding: "6px 10px" }}>
                …and {preview.length - 20} more
              </div>
            )}
          </div>

          <div style={{ marginTop: "16px", padding: "10px 14px", background: "var(--warning-muted)", border: "1px solid var(--warning)", borderRadius: "8px", fontSize: "12px", color: "var(--warning)" }}>
            ⚠️ Each chunk will consume 1 Gemini API call. Total: ~{preview.length} calls ({Math.ceil(preview.length / 60)} min at free tier speed).
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "10px 14px", background: "var(--danger-muted)", border: "1px solid var(--danger)", borderRadius: "8px", color: "var(--danger)", fontSize: "13px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, background: "var(--success-muted)", color: "var(--success)" }}>
              ✓ {succeeded} added
            </span>
            {failed > 0 && (
              <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, background: "var(--danger-muted)", color: "var(--danger)" }}>
                ✗ {failed} failed
              </span>
            )}
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
            {results.map((r, i) => (
              <div key={i} style={{
                padding: "6px 10px", borderRadius: "6px", fontSize: "12px",
                background: r.status === "ok" ? "var(--success-muted)" : "var(--danger-muted)",
                color: r.status === "ok" ? "var(--success)" : "var(--danger)",
                display: "flex", gap: "8px", alignItems: "flex-start",
              }}>
                <span>{r.status === "ok" ? "✓" : "✗"}</span>
                <span style={{ flex: 1 }}>{r.text.slice(0, 80)}{r.text.length > 80 ? "…" : ""}</span>
                {r.error && <span style={{ color: "var(--danger)", fontSize: "11px" }}>{r.error}</span>}
              </div>
            ))}
          </div>
          <a href="/chunks" style={{
            display: "inline-block", marginTop: "14px",
            padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff", textDecoration: "none",
          }}>
            View Knowledge Base →
          </a>
        </div>
      )}

      {/* Submit */}
      {preview.length > 0 && !results && (
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: "11px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
          background: loading ? "var(--text-muted)" : "linear-gradient(135deg, #6366f1, #818cf8)",
          border: "none", color: "#fff", cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 16px #6366f130",
        }}>
          {loading ? `Processing… (this may take ${Math.ceil(preview.length / 60) + 1} min)` : `Upload ${preview.length} Chunk${preview.length !== 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}
