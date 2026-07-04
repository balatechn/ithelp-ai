"use client";

import { BarChart3, TrendingUp, PieChart, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TICKET_TRENDS = [
  { month: "Jan", open: 45, resolved: 42 }, { month: "Feb", open: 52, resolved: 48 },
  { month: "Mar", open: 38, resolved: 41 }, { month: "Apr", open: 63, resolved: 59 },
  { month: "May", open: 71, resolved: 68 }, { month: "Jun", open: 58, resolved: 62 },
  { month: "Jul", open: 47, resolved: 51 },
];

const TOP_CATEGORIES = [
  { name: "Windows Issues", count: 89, pct: 28, color: "bg-blue-500" },
  { name: "Microsoft 365", count: 76, pct: 24, color: "bg-indigo-500" },
  { name: "Network/VPN", count: 54, pct: 17, color: "bg-cyan-500" },
  { name: "Hardware", count: 42, pct: 13, color: "bg-orange-500" },
  { name: "Security", count: 31, pct: 10, color: "bg-red-500" },
  { name: "Other", count: 25, pct: 8, color: "bg-gray-400" },
];

const maxCount = Math.max(...TICKET_TRENDS.map((t) => t.open));

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Last 30 days</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <Download className="w-4 h-4" />Export Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" />Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets", value: "317", change: "+12%" },
          { label: "Resolved", value: "299 (94%)", change: "↑ excellent" },
          { label: "Avg Resolution", value: "47 min", change: "-8 min" },
          { label: "SLA Compliance", value: "97.2%", change: "+1.4%" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-2xl p-5">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kpi.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
            <div className="text-xs font-medium mt-2 text-green-600 dark:text-green-400">{kpi.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Ticket Trends (7 months)</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {TICKET_TRENDS.map((t) => (
              <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-t-md hover:bg-blue-300 dark:hover:bg-blue-800 transition-colors" style={{ height: `${(t.open / maxCount) * 120}px` }} title={`Open: ${t.open}`} />
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Top Issue Categories</h3>
          </div>
          <div className="space-y-3">
            {TOP_CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", cat.color)} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{cat.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
