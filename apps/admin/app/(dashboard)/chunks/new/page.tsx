"use client";

import { useState, FormEvent } from "react";
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
import {
  ArrowLeft,
  PlusCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function NewChunkPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Chunk text cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const r = await fetch(`${API}/api/chunks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const json = await r.json();

      if (!r.ok) {
        setError(json.message || "Failed to add chunk.");
        return;
      }

      setSuccess(`Chunk successfully added and indexed in ChromaDB (ID: ${json.data.id})`);
      setText("");
    } catch {
      setError("Network error. Unable to reach server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* ── Back Navigation ── */}
      <div>
        <Link
          href="/chunks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Knowledge Base
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
          Add New Knowledge Chunk
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          New chunks are automatically embedded via Gemini and stored in ChromaDB vector store
        </p>
      </div>

      {/* ── Form Card ── */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Chunk Content
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Write a clear, factual statement about your background, projects, skills, or achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder="e.g. Sai has 3+ years of full-stack engineering experience, specializing in Next.js, Node.js, and PostgreSQL architecture."
                className="bg-slate-50/50 resize-y text-xs md:text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Keep each chunk focused on a single topic or fact.</span>
                <span className="font-mono">{text.length} characters</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading || !text.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Embedding & Saving…
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-1.5" />
                    Add Chunk
                  </>
                )}
              </Button>
              <Link href="/chunks">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Best Practices Card ── */}
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold text-amber-950">RAG Prompt Engineering Tip:</span>
          <p className="text-amber-800/90">
            For best chatbot accuracy, write sentences in third person (e.g. &ldquo;Sai developed…&rdquo; or &ldquo;Sai&apos;s email is…&rdquo;). Avoid vague pronouns like &ldquo;I&rdquo; or &ldquo;He&rdquo; without context so vector matches remain unambiguous.
          </p>
        </div>
      </div>
    </div>
  );
}
