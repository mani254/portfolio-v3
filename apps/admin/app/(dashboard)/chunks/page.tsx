"use client";

import { useEffect, useState, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Chunk { id: string; text: string; }
interface Meta { total: number; page: number; limit: number; totalPages: number; }

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600,
      background: `${color}20`, color,
    }}>{children}</span>
  );
}

export default function ChunksPage() {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // id to delete
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadChunks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const r = await fetch(`${API}/api/chunks?${params}`, { credentials: "include" });
      const json = await r.json();
      setChunks(json.data || []);
      setMeta(json.meta || null);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { loadChunks(); }, [loadChunks]);

  // ── Selection ─────────────────────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selected.size === chunks.length) setSelected(new Set());
    else setSelected(new Set(chunks.map((c) => c.id)));
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  function startEdit(chunk: Chunk) {
    setEditingId(chunk.id);
    setEditText(chunk.text);
  }

  async function saveEdit() {
    if (!editingId || !editText.trim()) return;
    setSaving(true);
    try {
      const r = await fetch(`${API}/api/chunks/${editingId}`, {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText.trim() }),
      });
      if (r.ok) { showToast("Chunk updated ✓"); setEditingId(null); loadChunks(); }
      else showToast("Update failed", "error");
    } finally { setSaving(false); }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function confirmDelete(id: string) {
    const r = await fetch(`${API}/api/chunks/${id}`, { method: "DELETE", credentials: "include" });
    if (r.ok) { showToast("Chunk deleted ✓"); setDeleteConfirm(null); loadChunks(); }
    else showToast("Delete failed", "error");
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    const r = await fetch(`${API}/api/chunks/bulk-delete`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    if (r.ok) { showToast(`Deleted ${selected.size} chunks ✓`); setSelected(new Set()); loadChunks(); }
    else showToast("Bulk delete failed", "error");
  }

  return (
    <div style={{ padding: "32px" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 1000,
          padding: "12px 20px", borderRadius: "10px",
          background: toast.type === "success" ? "var(--success-muted)" : "var(--danger-muted)",
          border: `1px solid ${toast.type === "success" ? "var(--success)" : "var(--danger)"}`,
          color: toast.type === "success" ? "var(--success)" : "var(--danger)",
          fontSize: "13px", fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Knowledge Base
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "13px" }}>
            {meta ? `${meta.total} chunks total` : "Loading…"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {selected.size > 0 && (
            <button onClick={bulkDelete} style={{
              padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
              background: "var(--danger-muted)", border: "1px solid var(--danger)", color: "var(--danger)", cursor: "pointer",
            }}>
              Delete {selected.size} selected
            </button>
          )}
          <a href="/chunks/upload" style={{
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
            background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
          }}>📤 Bulk Upload</a>
          <a href="/chunks/new" style={{
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #818cf8)", border: "none", color: "#fff",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
            boxShadow: "0 4px 16px #6366f130",
          }}>➕ Add Chunk</a>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search chunks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: "400px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "8px", padding: "9px 14px",
            color: "var(--text-primary)", fontSize: "13px", outline: "none",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Table */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "12px", overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "40px 1fr 160px",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          fontSize: "11px", fontWeight: 600, color: "var(--text-muted)",
          textTransform: "uppercase", letterSpacing: "0.06em",
          background: "var(--bg-secondary)",
        }}>
          <div>
            <input type="checkbox"
              checked={selected.size === chunks.length && chunks.length > 0}
              onChange={toggleAll}
              style={{ cursor: "pointer", accentColor: "var(--accent)" }}
            />
          </div>
          <div>Chunk Text</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : chunks.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            {debouncedSearch ? "No chunks match your search." : "No chunks yet. Add your first chunk!"}
          </div>
        ) : (
          chunks.map((chunk, i) => (
            <div key={chunk.id} style={{
              display: "grid", gridTemplateColumns: "40px 1fr 160px",
              padding: "12px 16px",
              borderBottom: i < chunks.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "flex-start",
              background: selected.has(chunk.id) ? "var(--accent-muted)" : "transparent",
              transition: "background 0.1s",
            }}>
              {/* Checkbox */}
              <div style={{ paddingTop: "2px" }}>
                <input type="checkbox"
                  checked={selected.has(chunk.id)}
                  onChange={() => toggleSelect(chunk.id)}
                  style={{ cursor: "pointer", accentColor: "var(--accent)" }}
                />
              </div>

              {/* Text or Edit textarea */}
              <div>
                {editingId === chunk.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%", background: "var(--bg-secondary)",
                        border: "1px solid var(--accent)", borderRadius: "6px",
                        padding: "8px 10px", color: "var(--text-primary)", fontSize: "13px",
                        resize: "vertical", outline: "none", fontFamily: "inherit",
                      }}
                    />
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={saveEdit} disabled={saving} style={{
                        padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                        background: "var(--success-muted)", border: "1px solid var(--success)", color: "var(--success)", cursor: "pointer",
                      }}>{saving ? "Saving…" : "Save"}</button>
                      <button onClick={() => setEditingId(null)} style={{
                        padding: "5px 12px", borderRadius: "6px", fontSize: "12px",
                        background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer",
                      }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                      {chunk.text}
                    </p>
                    <div style={{ marginTop: "6px" }}>
                      <Badge color="var(--text-muted)">{chunk.id}</Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                {deleteConfirm === chunk.id ? (
                  <>
                    <button onClick={() => confirmDelete(chunk.id)} style={{
                      padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                      background: "var(--danger)", border: "none", color: "#fff", cursor: "pointer",
                    }}>Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)} style={{
                      padding: "5px 10px", borderRadius: "6px", fontSize: "11px",
                      background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer",
                    }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(chunk)} style={{
                      padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500,
                      background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer",
                    }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(chunk.id)} style={{
                      padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500,
                      background: "var(--danger-muted)", border: "1px solid var(--danger)", color: "var(--danger)", cursor: "pointer",
                    }}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "20px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
            padding: "6px 14px", borderRadius: "7px", fontSize: "13px",
            background: "var(--bg-card)", border: "1px solid var(--border)", color: page === 1 ? "var(--text-muted)" : "var(--text-primary)",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}>← Prev</button>

          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            Page {meta.page} of {meta.totalPages}
          </span>

          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} style={{
            padding: "6px 14px", borderRadius: "7px", fontSize: "13px",
            background: "var(--bg-card)", border: "1px solid var(--border)", color: page === meta.totalPages ? "var(--text-muted)" : "var(--text-primary)",
            cursor: page === meta.totalPages ? "not-allowed" : "pointer",
          }}>Next →</button>
        </div>
      )}
    </div>
  );
}
