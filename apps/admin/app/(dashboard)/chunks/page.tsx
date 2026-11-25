"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  PlusCircle,
  UploadCloud,
  Trash2,
  Edit2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Chunk {
  id: string;
  text: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  const loadChunks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const r = await fetch(`${API}/api/chunks?${params}`, {
        credentials: "include",
      });
      const json = await r.json();
      setChunks(json.data || []);
      setMeta(json.meta || null);
    } catch {
      showToast("Failed to load chunks", "error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, showToast]);

  useEffect(() => {
    loadChunks();
  }, [loadChunks]);

  // Selection
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === chunks.length) setSelected(new Set());
    else setSelected(new Set(chunks.map((c) => c.id)));
  };

  // Edit
  function startEdit(chunk: Chunk) {
    setEditingId(chunk.id);
    setEditText(chunk.text);
  }

  async function saveEdit() {
    if (!editingId || !editText.trim()) return;
    setSaving(true);
    try {
      const r = await fetch(`${API}/api/chunks/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText.trim() }),
      });
      if (r.ok) {
        showToast("Chunk updated and re-embedded successfully ✓");
        setEditingId(null);
        loadChunks();
      } else {
        showToast("Update failed", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  // Delete
  async function confirmDelete(id: string) {
    const r = await fetch(`${API}/api/chunks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (r.ok) {
      showToast("Chunk deleted ✓");
      setDeleteConfirm(null);
      loadChunks();
    } else {
      showToast("Delete failed", "error");
    }
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    const r = await fetch(`${API}/api/chunks/bulk-delete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    if (r.ok) {
      showToast(`Deleted ${selected.size} chunks ✓`);
      setSelected(new Set());
      loadChunks();
    } else {
      showToast("Bulk delete failed", "error");
    }
  }

  function copyToClipboard(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-in fade-in slide-in-from-top-3 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Knowledge Base
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {meta ? `${meta.total} total chunks indexed in ChromaDB` : "Loading corpus…"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selected.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={bulkDelete}
              className="text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete {selected.size} selected
            </Button>
          )}

          <Link href="/chunks/upload">
            <Button variant="outline" size="sm" className="text-xs">
              <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Bulk Upload
            </Button>
          </Link>

          <Link href="/chunks/new">
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Add Chunk
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Filter / Search Bar ── */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search knowledge corpus by keywords…"
                className="pl-9 pr-8 h-9 text-xs md:text-sm bg-slate-50/50 border-slate-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadChunks()}
              title="Refresh table"
              className="h-9 px-3"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Data Table ── */}
      <Card className="border-slate-200/80 shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-slate-50/70">
                <TableHead className="w-10 pl-4">
                  <input
                    type="checkbox"
                    checked={chunks.length > 0 && selected.size === chunks.length}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="w-36">ID</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="w-24 text-center">Chars</TableHead>
                <TableHead className="w-28 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && chunks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading knowledge chunks…
                  </TableCell>
                </TableRow>
              ) : chunks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <div className="text-sm font-semibold text-slate-700">
                      No chunks found
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {search ? "Try adjusting your search query." : "Start by adding your first knowledge chunk."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                chunks.map((chunk) => {
                  const isSelected = selected.has(chunk.id);
                  const isEditing = editingId === chunk.id;
                  const isDeleting = deleteConfirm === chunk.id;

                  return (
                    <TableRow
                      key={chunk.id}
                      className={isSelected ? "bg-indigo-50/40" : ""}
                    >
                      {/* Checkbox */}
                      <TableCell className="pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(chunk.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </TableCell>

                      {/* ID with Copy */}
                      <TableCell className="font-mono text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-[90px]" title={chunk.id}>
                            {chunk.id.slice(0, 10)}…
                          </span>
                          <button
                            onClick={() => copyToClipboard(chunk.id)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                            title="Copy ID"
                          >
                            {copiedId === chunk.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Content or Edit Form */}
                      <TableCell>
                        {isEditing ? (
                          <div className="space-y-2 py-1">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={3}
                              className="text-xs leading-relaxed"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={saveEdit}
                                disabled={saving}
                                className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700"
                              >
                                {saving ? "Saving…" : "Save Changes"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(null)}
                                className="h-7 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs md:text-sm text-slate-800 leading-relaxed max-w-2xl">
                            {chunk.text}
                          </div>
                        )}
                      </TableCell>

                      {/* Char Count */}
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {chunk.text.length}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right pr-6">
                        {isDeleting ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-red-600 font-medium mr-1">
                              Delete?
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(chunk.id)}
                              className="h-7 px-2 text-xs"
                            >
                              Yes
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                              className="h-7 px-2 text-xs"
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(chunk)}
                              className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                              title="Edit chunk"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirm(chunk.id)}
                              className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete chunk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ── Pagination Footer ── */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
              <div>
                Page <span className="font-semibold text-slate-700">{meta.page}</span> of{" "}
                <span className="font-semibold text-slate-700">{meta.totalPages}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1 || loading}
                  className="h-7 px-2 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                  disabled={page >= meta.totalPages || loading}
                  className="h-7 px-2 text-xs"
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
