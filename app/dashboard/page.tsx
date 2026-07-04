"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket, Clock, TrendingUp, CheckCircle2,
  ArrowUpRight, Monitor, MessageSquare, Zap,
  AlertCircle, Activity, TrendingDown
} from "lucide-react";
import { cn, PRIORITY_COLORS, STATUS_COLORS, formatRelativeTime } from "@/lib/utils";

const STAT_CARDS = [
  {
    label: "Resolved today",
    value: 247,
    display: (v: number) => String(v),
    change: "+12%",
    up: true,
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    label: "Open tickets",
    value: 18,
    display: (v: number) => String(v),
    change: "-3",
    up: false,
    icon: Ticket,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    label: "Avg response",
    value: 0,
    display: () => "1.8 min",
    change: "-0.3 min",
    up: true,
    icon: Clock,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    label: "AI success rate",
    value: 94,
    display: (v: number) => `${v}%`,
    change: "+2%",
    up: true,
    icon: TrendingUp,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50 dark:bg-orange-900/20",
  },
];

const RECENT_TICKETS = [
  { id: "TKT-1042", title: "Outlook keeps crashing after Windows Update", priority: "high", status: "in-progress", user: "Sarah Chen", time: new Date(Date.now() - 5 * 60000) },
  { id: "TKT-1041", title: "VPN certificate expired — cannot connect", priority: "critical", status: "open", user: "Mike Johnson", time: new Date(Date.now() - 12 * 60000) },
  { id: "TKT-1040", title: "HP LaserJet printer offline on Floor 3", priority: "medium", status: "resolved", user: "Emily Davis", time: new Date(Date.now() - 45 * 60000) },
  { id: "TKT-1039", title: "SharePoint permissions not working", priority: "medium", status: "open", user: "Tom Wilson", time: new Date(Date.now() - 90 * 60000) },
  { id: "TKT-1038", title: "Blue screen MEMORY_MANAGEMENT error", priority: "high", status: "resolved", user: "Anna Lee", time: new Date(Date.now() - 3 * 3600000) },
];

const AI_SUGGESTIONS = [
  { title: "3 tickets may need escalation", desc: "SLA breach in < 2 hours", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-900/30" },
  { title: "Windows Update causing Outlook issues", desc: "Detected pattern across 5 tickets", icon: Activity, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-100 dark:border-orange-900/30" },
  { title: "New KB article suggested", desc: "VPN cert renewal procedure", icon: Zap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-900/30" },
];

const DEVICE_STATUS = [
  { label: "Online", value: 142, total: 153, color: "bg-green-500" },
  { label: "Warning", value: 8, total: 153, color: "bg-yellow-500" },
  { label: "Offline", value: 3, total: 153, color: "bg-red-500" },
];

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function DashboardPage() {
  const router = useRouter();
  const [animCounts, setAnimCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const targets = [247, 18, 0, 94];
    const steps = 50;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimCounts(targets.map((t) => Math.round((t * Math.min(step, steps)) / steps)));
      if (step >= steps) clearInterval(timer);
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
        <div className="relative">
          <h2 className="text-xl font-semibold mb-1">Good morning, IT Admin 👋</h2>
          <p className="text-blue-100 text-sm">
            You have <strong className="text-white font-semibold">18 open tickets</strong> and{" "}
            <strong className="text-white font-semibold">3 pending escalations</strong> today.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => router.push("/dashboard/chat")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Open AI Chat
            </button>
            <button
              onClick={() => router.push("/dashboard/tickets")}
              className="flex items-center gap-2 px-4 py-2 border border-white/30 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors"
            >
              <Ticket className="w-4 h-4" />
              View Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{card.label}</span>
              <div className={cn("p-2 rounded-xl", card.iconBg)}>
                <card.icon className={cn("w-4 h-4", card.iconColor)} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-3 tabular-nums">
              {card.display(animCounts[i])}
            </div>
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              card.up
                ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30"
                : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30"
            )}>
              {card.up
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent tickets</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Latest activity across all queues</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/tickets")}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {RECENT_TICKETS.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
              >
                {/* Priority dot */}
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", PRIORITY_DOT[ticket.priority])} />

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ticket.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    <span className="font-mono">{ticket.id}</span> · {ticket.user} · {formatRelativeTime(ticket.time)}
                  </p>
                </div>

                {/* Status chip */}
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 whitespace-nowrap",
                  STATUS_COLORS[ticket.status]
                )}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Insights */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI insights</h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Detected patterns</p>
              </div>
            </div>
            <div className="space-y-2">
              {AI_SUGGESTIONS.map((s) => (
                <div
                  key={s.title}
                  className={cn("flex items-start gap-3 p-3 rounded-xl border", s.bg, s.border)}
                >
                  <s.icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", s.color)} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">{s.title}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Health */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Device health</h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">153 total devices</p>
              </div>
            </div>
            <div className="space-y-3">
              {DEVICE_STATUS.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{d.label}</span>
                    <span className="text-gray-900 dark:text-white font-semibold tabular-nums">{d.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", d.color)}
                      style={{ width: `${Math.round((d.value / d.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/dashboard/devices")}
              className="mt-4 w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center justify-center gap-1"
            >
              View all devices <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
