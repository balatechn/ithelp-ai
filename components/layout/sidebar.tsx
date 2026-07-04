"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Ticket, Monitor, Users,
  BookOpen, BarChart2, Settings, Bot, ChevronLeft, ChevronRight,
  Zap, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat", dot: true },
  { icon: Ticket, label: "Tickets", href: "/dashboard/tickets" },
  { icon: Monitor, label: "Devices", href: "/dashboard/devices" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: BookOpen, label: "Knowledge Base", href: "/dashboard/knowledge" },
  { icon: BarChart2, label: "Reports", href: "/dashboard/reports" },
  { icon: Zap, label: "Automation", href: "/dashboard/automation" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const S = {
  sidebar: {
    background: "#0f172a",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  } as React.CSSProperties,
  logoRow: {
    height: 64, display: "flex", alignItems: "center", padding: "0 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, gap: 10,
  } as React.CSSProperties,
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  } as React.CSSProperties,
  logoText: { fontWeight: 700, fontSize: 18, color: "#f8fafc", letterSpacing: "-0.3px" } as React.CSSProperties,
  collapseBtn: {
    marginLeft: "auto", width: 28, height: 28, borderRadius: 8,
    background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0,
  } as React.CSSProperties,
  nav: {
    flex: 1, overflowY: "auto", padding: "12px 10px",
    display: "flex", flexDirection: "column", gap: 2,
  } as React.CSSProperties,
  navItem: {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
    borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
    background: "transparent", border: "none", outline: "none",
    width: "100%", textAlign: "left", color: "#94a3b8",
    transition: "all 0.15s", whiteSpace: "nowrap",
  } as React.CSSProperties,
  navItemActive: {
    background: "#3b82f6", color: "#ffffff",
    boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
  } as React.CSSProperties,
  dot: {
    width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
    marginLeft: "auto", flexShrink: 0,
  } as React.CSSProperties,
  aiCard: {
    margin: "0 10px 12px", borderRadius: 12,
    background: "linear-gradient(135deg,#1e3a5f,#1e1b4b)",
    border: "1px solid rgba(99,102,241,0.3)", padding: "16px 14px", flexShrink: 0,
  } as React.CSSProperties,
  aiCardHeader: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 } as React.CSSProperties,
  aiCardBtn: {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    background: "#3b82f6", border: "none", cursor: "pointer",
    color: "white", fontSize: 13, fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  } as React.CSSProperties,
  userRow: {
    borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 10px", flexShrink: 0,
  } as React.CSSProperties,
  userInner: {
    display: "flex", alignItems: "center", gap: 10, padding: 8,
    borderRadius: 10, cursor: "pointer",
  } as React.CSSProperties,
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0,
  } as React.CSSProperties,
} as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      style={{
        ...S.sidebar,
        width: collapsed ? 64 : 240,
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={S.logoRow}>
        <div style={S.logoIcon}>
          <Bot style={{ width: 20, height: 20, color: "white" }} />
        </div>
        {!collapsed && (
          <span style={S.logoText}>
            Help<span style={{ color: "#3b82f6" }}>AI</span>
          </span>
        )}
        <button style={S.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed
            ? <ChevronRight style={{ width: 14, height: 14 }} />
            : <ChevronLeft style={{ width: 14, height: 14 }} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              title={collapsed ? item.label : undefined}
              style={{
                ...S.navItem,
                ...(active ? S.navItemActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                }
              }}
            >
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.dot && <span style={S.dot} />}
            </button>
          );
        })}
      </nav>

      {/* AI assistant card */}
      {!collapsed && (
        <div style={S.aiCard}>
          <div style={S.aiCardHeader}>
            <Sparkles style={{ width: 16, height: 16, color: "#818cf8", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Need Help?</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Ask our AI Assistant</div>
            </div>
          </div>
          <button style={S.aiCardBtn} onClick={() => router.push("/dashboard/chat")}>
            <MessageSquare style={{ width: 14, height: 14 }} />
            Open AI Chat
          </button>
        </div>
      )}

      {/* User */}
      <div style={S.userRow}>
        <div style={S.userInner}>
          <div style={S.avatar}>IT</div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>IT Admin</div>
              <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Administrator</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
