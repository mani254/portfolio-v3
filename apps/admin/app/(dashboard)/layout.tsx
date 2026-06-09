"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/chunks", label: "Knowledge Base", icon: "🧠" },
  { href: "/chunks/new", label: "Add Chunk", icon: "➕" },
  { href: "/chunks/upload", label: "Upload / Bulk", icon: "📤" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (!json?.data || json.data.role !== "admin") {
          router.replace("/login");
          return;
        }
        setUser(json.data);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  }, [router]);

  async function handleLogout() {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    router.replace("/login");
  }

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Verifying access…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px",
        flexShrink: 0,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px",
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              borderRadius: "9px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", boxShadow: "0 4px 16px #6366f130",
            }}>⚡</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Jarvis Admin</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Knowledge Base</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "12px", flex: 1 }}>
          <div style={{ marginBottom: "4px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 8px 4px" }}>
              Navigation
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  marginBottom: "2px",
                  color: active ? "var(--accent-hover)" : "var(--text-secondary)",
                  background: active ? "var(--accent-muted)" : "transparent",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ fontSize: "15px" }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info + logout */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {user && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "8px", borderRadius: "7px",
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-secondary)", fontSize: "12px", fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--danger-muted)"; (e.currentTarget as HTMLElement).style.color = "var(--danger)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--danger)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto", background: "var(--bg-primary)" }}>
        {children}
      </main>
    </div>
  );
}
