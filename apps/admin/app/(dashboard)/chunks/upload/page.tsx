"use client";

import { useState, useRef, DragEvent } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  AlignLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ResultItem = {
  id: string;
  text: string;
  status: "ok" | "error";
  error?: string;
};
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

  function handlePasteChange(val: string) {
    setPasteText(val);
    setPreview(
      val
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("#"))
    );
    setResults(null);
  }

  function handleFileSelect(f: File) {
    if (!f.name.endsWith(".txt")) {
      setError("Only .txt files are supported.");
      return;
    }
    setError("");
    setFile(f);
    setResults(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = (e.target?.result as string)
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("#"));
      setPreview(lines);
    };
    reader.readAsText(f);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }

  async function handleSubmit() {
    if (preview.length === 0) {
      setError("Please provide at least one valid line to upload.");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);

    try {
      let r: Response;
      if (mode === "paste") {
        r = await fetch(`${API}/api/chunks/bulk`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: preview }),
        });
      } else {
        const form = new FormData();
        form.append("file", file!);
        r = await fetch(`${API}/api/chunks/upload`, {
          method: "POST",
          credentials: "include",
          body: form,
        });
      }
      const json = await r.json();
      if (!r.ok) {
        setError(json.message || "Upload failed.");
        return;
      }
      setResults(json.data);
    } catch {
      setError("Network error. Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  const succeeded = results?.filter((r) => r.status === "ok").length ?? 0;
  const failed = results?.filter((r) => r.status === "error").length ?? 0;

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── Header ── */}
      <div>
        <Link
          href="/chunks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Knowledge Base
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
          Bulk Knowledge Upload
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Add multiple chunks simultaneously. Each non-empty line becomes an individual knowledge entry.
        </p>
      </div>

      {/* ── Mode Switcher ── */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => {
            setMode("paste");
            setPreview([]);
            setResults(null);
            setError("");
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150",
            mode === "paste"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          Paste Text Lines
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("file");
            setPreview([]);
            setResults(null);
            setError("");
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150",
            mode === "file"
              ? "bg-white text-indigo-700 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          Upload .txt File
        </button>
      </div>

      {/* ── Input Card ── */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            {mode === "paste" ? "Raw Text Input" : "File Attachment"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {mode === "paste"
              ? "Enter one statement per line. Empty lines or lines starting with # are automatically ignored."
              : "Select a plaintext .txt file containing one chunk statement per line."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "paste" ? (
            <Textarea
              value={pasteText}
              onChange={(e) => handlePasteChange(e.target.value)}
              rows={8}
              placeholder={`Sai specializes in React and Next.js applications.\nSai built a real-time collaborative workspace with WebSockets.\nSai has 3+ years experience with PostgreSQL and Docker.`}
              className="bg-slate-50/50 font-mono text-xs leading-relaxed"
            />
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150",
                dragging
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-slate-200 hover:border-indigo-400 bg-slate-50/30"
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <FileUp className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {file ? file.name : "Drop your .txt file here, or browse"}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB · Click to replace`
                  : "Supports .txt plain text documents up to 5MB"}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Preview list before submit ── */}
          {preview.length > 0 && !results && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Preview Parsed Chunks</span>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {preview.length} {preview.length === 1 ? "chunk" : "chunks"} detected
                </Badge>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-600">
                {preview.map((line, i) => (
                  <div key={i} className="flex items-start gap-2 py-0.5 font-mono">
                    <span className="text-slate-400 shrink-0 w-5 text-right">{i + 1}.</span>
                    <span className="truncate">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading || preview.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Embedding & Indexing {preview.length} chunks…
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-1.5" />
                  Upload & Embed {preview.length} Chunks
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Results summary ── */}
      {results && (
        <Card className="border-slate-200/80 shadow-2xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900">
                Upload Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  {succeeded} Successful
                </Badge>
                {failed > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {failed} Failed
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {results.map((res, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start justify-between gap-3 p-2.5 rounded-lg border",
                    res.status === "ok"
                      ? "bg-emerald-50/50 border-emerald-200/70 text-slate-800"
                      : "bg-red-50/50 border-red-200/70 text-red-900"
                  )}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {res.status === "ok" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="truncate">{res.text}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {res.id ? res.id.slice(0, 8) : res.error}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link href="/chunks">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                  View in Knowledge Base
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setResults(null);
                  setPreview([]);
                  setPasteText("");
                  setFile(null);
                }}
              >
                Upload More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
