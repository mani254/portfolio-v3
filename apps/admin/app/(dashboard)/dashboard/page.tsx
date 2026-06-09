"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Stats { total: number; collectionName: string; }

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "20px 24px",
      display: "flex", alignItems: "center", gap: "16px",
    }}>
      <div style={{
        width: "44px", height: "44px",
        background: `${color}20`,
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px",
        flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function loadStats() {
    try {
      const r = await fetch(`${API}/api/chunks/stats`, { credentials: "include" });
      if (r.ok) setStats((await r.json()).data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStats(); }, []);

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px", fontSize: "14px" }}>
          Overview of your AI chatbot knowledge base.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard
          label="Total Chunks"
          value={loading ? "…" : stats?.total ?? 0}
          icon="🧠"
          color="#6366f1"
        />
        <StatCard
          label="Collection"
          value={loading ? "…" : stats?.collectionName ?? "portfolio"}
          icon="🗄️"
          color="#22c55e"
        />
        <StatCard
          label="Storage"
          value="ChromaDB"
          icon="⚡"
          color="#f59e0b"
        />
      </div>

      {/* Quick actions */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
      }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[
            { href: "/chunks", label: "View All Chunks", icon: "📋" },
            { href: "/chunks/new", label: "Add New Chunk", icon: "➕" },
            { href: "/chunks/upload", label: "Bulk Upload", icon: "📤" },
          ].map((a) => (
            <a key={a.href} href={a.href} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 16px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 500,
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            >
              <span>{a.icon}</span> {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div style={{
        background: "var(--accent-muted)",
        border: "1px solid var(--accent)",
        borderRadius: "10px",
        padding: "16px 20px",
        color: "var(--accent-hover)",
        fontSize: "13px",
        lineHeight: 1.7,
      }}>
        <strong>How it works:</strong> Chunks are stored in ChromaDB. When you add or edit a chunk, it gets embedded immediately via Gemini. The chatbot retrieves the most relevant chunks for each user question using cosine similarity.
      </div>
    </div>
  );
}
