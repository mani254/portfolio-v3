"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function NewChunkPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) { setError("Chunk text cannot be empty."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const r = await fetch(`${API}/api/chunks`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const json = await r.json();
      if (!r.ok) { setError(json.message || "Failed to add chunk."); return; }
      setSuccess(`Chunk added with ID: ${json.data.id}`);
      setText("");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "680px" }}>
      <div style={{ marginBottom: "28px" }}>
        <a href="/chunks" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
          ← Back to Knowledge Base
        </a>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginTop: "12px", letterSpacing: "-0.02em" }}>
          Add New Chunk
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
          The chunk will be embedded immediately via Gemini and stored in ChromaDB.
        </p>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Chunk Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="e.g. He has experience with PostgreSQL query optimization and indexing strategies."
              style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: "8px", padding: "12px 14px",
                color: "var(--text-primary)", fontSize: "14px",
                resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6,
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {text.length} characters · Keep chunks focused on one fact or topic.
            </div>
          </div>

          {error && (
            <div style={{ background: "var(--danger-muted)", border: "1px solid var(--danger)", borderRadius: "8px", padding: "10px 14px", color: "var(--danger)", fontSize: "13px" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "var(--success-muted)", border: "1px solid var(--success)", borderRadius: "8px", padding: "10px 14px", color: "var(--success)", fontSize: "13px" }}>
              {success}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading} style={{
              padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
              background: loading ? "var(--text-muted)" : "linear-gradient(135deg, #6366f1, #818cf8)",
              border: "none", color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px #6366f130",
            }}>
              {loading ? "Embedding & Saving…" : "Add Chunk"}
            </button>
            <button type="button" onClick={() => router.push("/chunks")} style={{
              padding: "10px 20px", borderRadius: "8px", fontSize: "14px",
              background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer",
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div style={{ marginTop: "20px", padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Tips for Good Chunks
        </div>
        <ul style={{ color: "var(--text-muted)", fontSize: "12px", lineHeight: 1.9, paddingLeft: "16px" }}>
          <li>One fact or topic per chunk — don't mix unrelated information</li>
          <li>Write in third person: "He has..." or "Manikanta built..."</li>
          <li>Keep it under 200 characters for best retrieval accuracy</li>
          <li>Use specific details: project names, numbers, technologies</li>
        </ul>
      </div>
    </div>
  );
}
