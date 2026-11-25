"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Layers,
  Cpu,
  PlusCircle,
  UploadCloud,
  ArrowRight,
  Info,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Stats {
  total: number;
  collectionName: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadStats() {
    try {
      const r = await fetch(`${API}/api/chunks/stats`, {
        credentials: "include",
      });
      if (r.ok) {
        const json = await r.json();
        setStats(json.data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    loadStats();
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor and manage your portfolio&apos;s AI chatbot retrieval corpus
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing…" : "Sync Stats"}
          </Button>
          <Link href="/chunks/new">
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Add Chunk
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Chunks */}
        <Card className="border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Knowledge Chunks
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {loading ? (
                <span className="text-slate-300">…</span>
              ) : (
                stats?.total ?? 0
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Embedded in ChromaDB vector store
            </p>
          </CardContent>
        </Card>

        {/* Collection Name */}
        <Card className="border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Collection
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 truncate">
              {loading ? (
                <span className="text-slate-300">…</span>
              ) : (
                stats?.collectionName ?? "portfolio"
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target collection for similarity search
            </p>
          </CardContent>
        </Card>

        {/* Embedding Engine */}
        <Card className="border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Embedding Pipeline
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              Gemini + Chroma
            </div>
            <p className="text-xs text-slate-500 mt-1">
              768-dim semantic vector search
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <Card className="border-slate-200/80 shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks to keep Jarvis up-to-date with your latest experience and projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Action 1 */}
            <Link
              href="/chunks"
              className="group p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Database className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Manage Chunks
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Browse, search, edit, or delete existing knowledge entries.
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                Browse list <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Action 2 */}
            <Link
              href="/chunks/new"
              className="group p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Add Single Chunk
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Teach Jarvis a new skill, project highlight, or contact detail.
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                Create new <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Action 3 */}
            <Link
              href="/chunks/upload"
              className="group p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Bulk Upload
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Import multiple facts at once via plain text or file upload.
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                Upload corpus <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ── Architecture callout ── */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs text-indigo-950 leading-relaxed">
          <div className="font-semibold text-indigo-900 text-sm">
            How the RAG Pipeline Works
          </div>
          <p className="text-indigo-800/90">
            Each chunk added here is converted into high-dimensional vector embeddings using Google&apos;s Gemini model. When a visitor chats with Jarvis on your portfolio website, their prompt is matched against these chunks using cosine similarity to provide accurate, grounded answers.
          </p>
        </div>
      </div>
    </div>
  );
}
