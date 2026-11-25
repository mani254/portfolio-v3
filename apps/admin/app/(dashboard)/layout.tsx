"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Database,
  PlusCircle,
  UploadCloud,
  LogOut,
  ExternalLink,
  Bot,
  Shield,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const NAV_ITEMS = [
  {
    category: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    category: "Knowledge Base",
    items: [
      { href: "/chunks", label: "All Chunks", icon: Database },
      { href: "/chunks/new", label: "Add Chunk", icon: PlusCircle },
      { href: "/chunks/upload", label: "Bulk Upload", icon: UploadCloud },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
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
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.replace("/login");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="text-sm font-medium text-slate-500">
          Verifying authorization…
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 flex flex-col sticky top-0 h-screen z-30 shadow-2xs">
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 leading-none">
              Jarvis Admin
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-indigo-200 text-indigo-700 bg-indigo-50 font-semibold">
                v3
              </Badge>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              RAG Knowledge Base
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1 space-y-6 overflow-y-auto">
          {NAV_ITEMS.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                {group.category}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", active ? "text-indigo-600" : "text-slate-400")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Public site link */}
        <div className="px-3 pb-3">
          <a
            href="http://localhost:1234"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-dashed border-slate-200"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              Live Portfolio
            </span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
              Web
            </span>
          </a>
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1">
                  {user?.name || "Administrator"}
                </div>
                <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-emerald-600" />
                  {user?.email || "admin"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sign out"
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Admin Control</span>
            <span>/</span>
            <span className="capitalize text-slate-900 font-semibold">
              {pathname.split("/").filter(Boolean)[0] || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-medium text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ChromaDB Connected
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
