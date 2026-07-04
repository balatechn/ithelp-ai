"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, Ticket, Clock, TrendingUp, AlertCircle, CheckCircle2,
  ArrowUpRight, Monitor, MessageSquare, Zap
} from "lucide-react";
import { cn, PRIORITY_COLORS, STATUS_COLORS, formatRelativeTime } from "@/lib/utils";

const STAT_CARDS = [
  { label: "Resolved Today", value: 247, change: "+12%", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  { label: "Open Tickets", value: 18, change: "-3", icon: Ticket, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Avg Response", value: 0, change: "-0.3 min", icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { label: "AI Success Rate", value: 94, change: "+2%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
];

const RECENT_TICKETS = [
  { id: "TKT-1042", title: "Outlook keeps crashing after Windows Update", priority: "high", status: "in-progress", user: "Sarah Chen", time: new Date(Date.now() - 5 * 60000) },
  { id: "TKT-1041", title: "VPN certificate expired - cannot connect", priority: "critical", status: "open", user: "Mike Johnson", time: new Date(Date.now() - 12 * 60000) },
  { id: "TKT-1040", title: "HP LaserJet printer offline on Floor 3", priority: "medium", status: "resolved", user: "Emily Davis", time: new Date(Date.now() - 45 * 60000) },
  { id: "TKT-1039", title: "SharePoint permissions not working", priority: "medium", status: "open", user: "Tom Wilson", time: new Date(Date.now() - 90 * 60000) },
  { id: "TKT-1038", title: "Blue screen MEMORY_MANAGEMENT error", priority: "high", status: "resolved", user: "Anna Lee", time: new Date(Date.now() - 3 * 3600000) },
];

const AI_SUGGESTIONS = [
  { title: "3 tickets may need escalation", desc: "SLA breach in < 2 hours", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  { title: "Windows Update causing Outlook issues", desc: "Detected pattern across 5 tickets", icon: Activity, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { title: "New KB article suggested", desc: "VPN cert renewal procedure", icon: Zap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
];

const DEVICE_STATUS = [
  { label: "Online", value: 142, color: "bg-green-500" },
  { label: "Warning", value: 8, color: "bg-yellow-500" },
  { label: "Offline", value: 3, color: "bg-red-500" },
];

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-4 right-16 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="relative">
          <h2 className="text-xl font-bold mb-1">Good morning, IT Admin 👋</h2>
          <p className="text-blue-200 text-sm">
            You have <strong className="text-white">18 open tickets</strong> and <strong className="text-white">3 pending escalations</strong> today.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => router.push("/dashboard/chat")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Open AI Chat
            </button>
            <button
              onClick={() => router.push("/dashboard/tickets")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/30 text-white text-sm font-medium rounded-xl hover:bg-blue-500/40 transition-colors border border-white/20"
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
          <div key={card.label} className="glass-card rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", card.bg)}>
                <card.icon className={cn("w-5 h-5", card.color)} />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {i === 2 ? "1.8 min" : i === 3 ? `${animCounts[3]}%` : animCounts[i]}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
            <button
              onClick={() => router.push("/dashboard/tickets")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_TICKETS.map((ticket) => (
              <div key={ticket.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{ticket.id}</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide", PRIORITY_COLORS[ticket.priority])}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{ticket.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ticket.user} · {formatRelativeTime(ticket.time)}</p>
                </div>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex-shrink-0", STATUS_COLORS[ticket.status])}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {AI_SUGGESTIONS.map((s) => (
                <div key={s.title} className={cn("flex items-start gap-3 p-3 rounded-xl", s.bg)}>
                  <s.icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", s.color)} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Overview */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Device Health</h3>
            </div>
            <div className="space-y-3">
              {DEVICE_STATUS.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", d.color)} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{d.label}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{d.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", d.color)}
                        style={{ width: `${(d.value / 153) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/dashboard/devices")}
              className="mt-4 w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all devices →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
