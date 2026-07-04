"use client";

import { useRouter } from "next/navigation";
import {
  Ticket, TrendingUp, CheckCircle2, AlertTriangle,
  Plus, KeyRound, Download, Unlock, Wifi, Printer,
  ServerCrash, MoreHorizontal, ArrowUpRight, MoreVertical,
  ChevronRight, BookOpen, Megaphone
} from "lucide-react";

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 120, H = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x},${y}`;
  });
  const fillPts = `0,${H} ${pts.join(" ")} ${W},${H}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#g${color.replace("#", "")})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Donut Chart ─────────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { pct: number; color: string }[] }) {
  let acc = 0;
  const items = segments.map((s) => {
    const start = acc;
    acc += s.pct;
    return { ...s, start };
  });
  const stops = items.map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(", ");
  return (
    <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: `conic-gradient(${stops})`,
      }} />
      <div style={{
        position: "absolute", inset: 32, borderRadius: "50%",
        background: "#1e293b", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9" }}>56</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>Total</div>
      </div>
    </div>
  );
}

// ── Constants ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0f172a",
  card: "#1e293b",
  cardBorder: "rgba(255,255,255,0.06)",
  text: "#f1f5f9",
  muted: "#64748b",
  subtle: "#94a3b8",
};

const STAT_CARDS = [
  {
    label: "Open Tickets", value: "18", icon: Ticket, iconBg: "#1e40af", iconColor: "#60a5fa",
    trend: "-3 vs yesterday", trendUp: false, trendColor: "#ef4444",
    sparkData: [10, 14, 12, 18, 16, 20, 18], sparkColor: "#3b82f6",
  },
  {
    label: "AI Success Rate", value: "94%", icon: TrendingUp, iconBg: "#14532d", iconColor: "#4ade80",
    trend: "+2% vs yesterday", trendUp: true, trendColor: "#22c55e",
    sparkData: [88, 90, 89, 92, 91, 93, 94], sparkColor: "#22c55e",
  },
  {
    label: "Resolved Today", value: "32", icon: CheckCircle2, iconBg: "#4c1d95", iconColor: "#a78bfa",
    trend: "+6 vs yesterday", trendUp: true, trendColor: "#22c55e",
    sparkData: [20, 22, 26, 28, 24, 30, 32], sparkColor: "#a78bfa",
  },
  {
    label: "Pending Escalations", value: "3", icon: AlertTriangle, iconBg: "#7c2d12", iconColor: "#fb923c",
    trend: "0 change", trendUp: null, trendColor: "#94a3b8",
    sparkData: [5, 4, 4, 3, 5, 3, 3], sparkColor: "#f97316",
  },
];

const TICKETS = [
  { id: "TKT-1042", subject: "Outlook keeps crashing after...", requester: "Sarah Chen", status: "In Progress", priority: "Medium", updated: "5m ago" },
  { id: "TKT-1041", subject: "VPN certificate expired - cannot...", requester: "Mike Johnson", status: "Open", priority: "High", updated: "12m ago" },
  { id: "TKT-1040", subject: "Printer not printing", requester: "David Lee", status: "Pending", priority: "Medium", updated: "18m ago" },
  { id: "TKT-1039", subject: "Teams call dropping frequently", requester: "Emily Davis", status: "In Progress", priority: "High", updated: "25m ago" },
  { id: "TKT-1038", subject: "Cannot access shared drive", requester: "James Wilson", status: "Open", priority: "Low", updated: "32m ago" },
];

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  "In Progress": { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  "Open": { bg: "rgba(100,116,139,0.2)", color: "#94a3b8" },
  "Pending": { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
  "Resolved": { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
};
const PRIORITY_BADGE: Record<string, { bg: string; color: string }> = {
  "High": { bg: "rgba(249,115,22,0.15)", color: "#fb923c" },
  "Medium": { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  "Low": { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  "Critical": { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
};

const DONUT_SEGMENTS = [
  { pct: 32, color: "#3b82f6", label: "Open", count: 18 },
  { pct: 36, color: "#6366f1", label: "In Progress", count: 20 },
  { pct: 18, color: "#f97316", label: "Pending", count: 10 },
  { pct: 14, color: "#22c55e", label: "Resolved", count: 8 },
];

const QUICK_ACTIONS = [
  { icon: Plus, label: "Create Ticket", color: "#3b82f6" },
  { icon: KeyRound, label: "Reset Password", color: "#3b82f6" },
  { icon: Download, label: "Install Software", color: "#3b82f6" },
  { icon: Unlock, label: "Unlock Account", color: "#ef4444" },
  { icon: Wifi, label: "Network Issue", color: "#3b82f6" },
  { icon: Printer, label: "Printer Issue", color: "#3b82f6" },
  { icon: ServerCrash, label: "Report Device", color: "#3b82f6" },
  { icon: MoreHorizontal, label: "More Actions", color: "#64748b" },
];

const KB_ARTICLES = [
  { title: "How to fix Outlook crashing issue", views: "1.2k views" },
  { title: "VPN connection troubleshooting guide", views: "980 views" },
  { title: "How to clear Windows update cache", views: "870 views" },
  { title: "Fix slow performance on Windows 11", views: "760 views" },
];

const ANNOUNCEMENTS = [
  {
    title: "Scheduled Maintenance",
    desc: "System maintenance on May 18, 2025 from 11 PM to 2 AM.",
    time: "2h ago",
    isNew: true,
    color: "#3b82f6",
  },
  {
    title: "New Feature Release",
    desc: "AI Copilot now available in IT Help AI Chat.",
    time: "1d ago",
    isNew: false,
    color: "#6366f1",
  },
];

// ── Card shell ──────────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderRadius: 16, ...style,
    }}>
      {children}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────────
function Badge({ label, scheme }: { label: string; scheme: { bg: string; color: string } }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
      background: scheme.bg, color: scheme.color, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", { weekday: undefined, year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, minHeight: "100%", background: C.bg }}>

      {/* Welcome row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Welcome back, IT Admin 👋</h2>
          <p style={{ fontSize: 14, color: C.subtle, marginTop: 4 }}>
            You have <strong style={{ color: C.text }}>18 open tickets</strong> and <strong style={{ color: C.text }}>3 pending escalations</strong> today.
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
          borderRadius: 10, background: C.card, border: `1px solid ${C.cardBorder}`,
          fontSize: 13, color: C.subtle,
        }}>
          📅 {today}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {STAT_CARDS.map((s) => (
          <Card key={s.label} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{s.label}</div>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: s.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <s.icon style={{ width: 18, height: 18, color: s.iconColor }} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.trendColor, marginBottom: 12 }}>
              {s.trendUp === true ? "▲ " : s.trendUp === false ? "▼ " : "○ "}{s.trend}
            </div>
            <Sparkline data={s.sparkData} color={s.sparkColor} />
          </Card>
        ))}
      </div>

      {/* Middle row: Recent Tickets + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        {/* Recent Tickets */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Recent Tickets</div>
            <button
              onClick={() => router.push("/dashboard/tickets")}
              style={{ fontSize: 13, color: "#60a5fa", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              View all <ArrowUpRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 130px 110px 90px 70px", gap: 8, padding: "6px 8px", marginBottom: 4 }}>
            {["ID #", "Subject", "Requester", "Status", "Priority", "Updated"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {TICKETS.map((t) => (
            <div key={t.id} style={{
              display: "grid", gridTemplateColumns: "100px 1fr 130px 110px 90px 70px",
              gap: 8, padding: "10px 8px", borderRadius: 8, alignItems: "center",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa", fontFamily: "monospace" }}>{t.id}</div>
              <div style={{ fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</div>
              <div style={{ fontSize: 13, color: C.subtle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.requester}</div>
              <Badge label={t.status} scheme={STATUS_BADGE[t.status] ?? STATUS_BADGE["Open"]} />
              <Badge label={t.priority} scheme={PRIORITY_BADGE[t.priority] ?? PRIORITY_BADGE["Medium"]} />
              <div style={{ fontSize: 12, color: C.muted }}>{t.updated}</div>
            </div>
          ))}
        </Card>

        {/* Tickets by Status */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Tickets by Status</div>
            <button style={{ fontSize: 13, color: "#60a5fa", background: "none", border: "none", cursor: "pointer" }}>View report</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <DonutChart segments={DONUT_SEGMENTS} />
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              {DONUT_SEGMENTS.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.subtle }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.count} ({s.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row: Quick Actions + KB Articles + Announcements */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Quick Actions */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ticket style={{ width: 14, height: 14, color: "#60a5fa" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Quick Actions</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "14px 8px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${C.cardBorder}`,
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <a.icon style={{ width: 18, height: 18, color: a.color }} />
                </div>
                <span style={{ fontSize: 11, color: C.subtle, textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Top Knowledge Articles */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen style={{ width: 14, height: 14, color: "#c084fc" }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Top Knowledge Articles</div>
            </div>
            <button
              onClick={() => router.push("/dashboard/knowledge")}
              style={{ fontSize: 12, color: "#60a5fa", background: "none", border: "none", cursor: "pointer" }}
            >View all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {KB_ARTICLES.map((a, i) => (
              <div key={i}
                style={{ padding: "10px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: 13, color: C.text, marginBottom: 3, lineHeight: 1.4 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{a.views}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Megaphone style={{ width: 14, height: 14, color: "#fb923c" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Announcements</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} style={{
                padding: "12px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)", border: `1px solid ${C.cardBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.title}</span>
                  {a.isNew && (
                    <span style={{ padding: "1px 6px", borderRadius: 4, background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700 }}>New</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.subtle, lineHeight: 1.5, marginBottom: 4 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{a.time}</div>
              </div>
            ))}
          </div>
          <button style={{
            marginTop: 12, width: "100%", fontSize: 13, color: "#60a5fa",
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            View all announcements <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </Card>
      </div>

      {/* Status footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderRadius: 10,
        background: "rgba(255,255,255,0.02)", border: `1px solid ${C.cardBorder}`,
        fontSize: 12, color: C.muted,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ color: "#22c55e", fontWeight: 500 }}>System Status</span>
          <span>•</span>
          <span>All Systems Operational</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          <span>•</span>
          <span style={{ cursor: "pointer" }}>Terms of Service</span>
          <span>•</span>
          <span>© 2025 IT Help AI. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
