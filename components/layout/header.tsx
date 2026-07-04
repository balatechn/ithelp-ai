"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Moon, Sun, Command, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/chat": "AI Chat",
  "/dashboard/tickets": "Support Tickets",
  "/dashboard/devices": "Device Inventory",
  "/dashboard/users": "User Management",
  "/dashboard/knowledge": "Knowledge Base",
  "/dashboard/reports": "Reports & Analytics",
  "/dashboard/automation": "Automation",
  "/dashboard/settings": "Settings",
};

interface HeaderProps { onCmdK?: () => void }

export function Header({ onCmdK }: HeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const headerBg = isDark ? "#0f172a" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb";
  const searchBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
  const searchBorder = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const iconColor = isDark ? "#64748b" : "#6b7280";
  const textPrimary = isDark ? "#f1f5f9" : "#111827";
  const textSecondary = isDark ? "#64748b" : "#6b7280";

  return (
    <header style={{
      height: 64, display: "flex", alignItems: "center", gap: 16,
      padding: "0 24px", borderBottom: `1px solid ${borderColor}`,
      background: headerBg, position: "sticky", top: 0, zIndex: 30, flexShrink: 0,
    }}>
      {/* Search bar */}
      <button
        onClick={onCmdK}
        style={{
          flex: 1, maxWidth: 480, display: "flex", alignItems: "center", gap: 10,
          padding: "0 14px", height: 40, borderRadius: 10,
          background: searchBg, border: `1px solid ${searchBorder}`,
          cursor: "pointer", textAlign: "left",
        }}
      >
        <Search style={{ width: 16, height: 16, color: iconColor, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 14, color: textSecondary }}>
          Search tickets, users, devices, articles...
        </span>
        <span style={{
          display: "flex", alignItems: "center", gap: 2,
          fontSize: 11, color: textSecondary,
          background: isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb",
          padding: "2px 6px", borderRadius: 6, fontFamily: "monospace", flexShrink: 0,
        }}>
          <Command style={{ width: 10, height: 10 }} />K
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
        {/* Notifications */}
        <button style={{
          position: "relative", width: 36, height: 36, borderRadius: 10,
          background: "transparent", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", color: iconColor,
        }}>
          <Bell style={{ width: 18, height: 18 }} />
          <span style={{
            position: "absolute", top: 6, right: 6, width: 16, height: 16,
            borderRadius: "50%", background: "#ef4444", color: "white",
            fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
          }}>5</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: iconColor,
          }}
        >
          {isDark ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: borderColor }} />

        {/* User profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>IT</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, lineHeight: 1.2 }}>IT Admin</div>
            <div style={{ fontSize: 11, color: textSecondary, lineHeight: 1.2 }}>Administrator</div>
          </div>
          <ChevronDown style={{ width: 14, height: 14, color: iconColor }} />
        </div>
      </div>
    </header>
  );
}
