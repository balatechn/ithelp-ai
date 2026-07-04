"use client";

import { useState } from "react";
import { Plus, Search, Ticket, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn, PRIORITY_COLORS, STATUS_COLORS, formatRelativeTime } from "@/lib/utils";
import type { Ticket as TicketType } from "@/types";

const MOCK_TICKETS: TicketType[] = [
  { id: "TKT-1042", title: "Outlook keeps crashing after Windows Update KB5034441", description: "User reports Outlook crashes immediately after applying latest Windows Update.", priority: "high", status: "in-progress", category: "Email", department: "Finance", assignee: "John Smith", createdAt: new Date(Date.now() - 5 * 60000), updatedAt: new Date() },
  { id: "TKT-1041", title: "VPN certificate expired - all remote users cannot connect", description: "GlobalProtect VPN certificate expired, blocking all remote workers.", priority: "critical", status: "open", category: "Network", department: "IT", assignee: undefined, createdAt: new Date(Date.now() - 12 * 60000), updatedAt: new Date() },
  { id: "TKT-1040", title: "HP LaserJet printer offline on Floor 3", description: "Printer shows offline in print queue despite being powered on.", priority: "medium", status: "resolved", category: "Hardware", department: "Operations", assignee: "Emily Davis", createdAt: new Date(Date.now() - 45 * 60000), updatedAt: new Date() },
  { id: "TKT-1039", title: "SharePoint permissions not syncing for new users", description: "Newly created AD accounts cannot access SharePoint sites.", priority: "medium", status: "open", category: "Microsoft 365", department: "HR", assignee: "Tom Wilson", createdAt: new Date(Date.now() - 90 * 60000), updatedAt: new Date() },
  { id: "TKT-1038", title: "Blue screen MEMORY_MANAGEMENT error on workstation PC-042", description: "BSOD occurring multiple times per day on user's workstation.", priority: "high", status: "resolved", category: "Hardware", department: "Engineering", assignee: "Anna Lee", createdAt: new Date(Date.now() - 3 * 3600000), updatedAt: new Date() },
  { id: "TKT-1037", title: "Teams calls dropping every 5 minutes", description: "Multiple users on same subnet experiencing Teams call drops.", priority: "high", status: "in-progress", category: "Microsoft 365", department: "Sales", assignee: "Mark Chen", createdAt: new Date(Date.now() - 5 * 3600000), updatedAt: new Date() },
  { id: "TKT-1036", title: "Cannot access network drive Z: after password reset", description: "After AD password reset, user cannot reconnect to mapped drives.", priority: "medium", status: "resolved", category: "Active Directory", department: "Marketing", assignee: "Lisa Park", createdAt: new Date(Date.now() - 8 * 3600000), updatedAt: new Date() },
  { id: "TKT-1035", title: "Ransomware alert triggered on endpoint PC-087", description: "Defender triggered ransomware protection on user workstation.", priority: "critical", status: "closed", category: "Security", department: "Finance", assignee: "Security Team", createdAt: new Date(Date.now() - 24 * 3600000), updatedAt: new Date() },
];

const STATUS_TABS = ["all", "open", "in-progress", "resolved", "closed"] as const;

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showNewTicket, setShowNewTicket] = useState(false);

  const filtered = MOCK_TICKETS.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = {
    all: MOCK_TICKETS.length,
    open: MOCK_TICKETS.filter((t) => t.status === "open").length,
    "in-progress": MOCK_TICKETS.filter((t) => t.status === "in-progress").length,
    resolved: MOCK_TICKETS.filter((t) => t.status === "resolved").length,
    closed: MOCK_TICKETS.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support Tickets</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{MOCK_TICKETS.length} total tickets</p>
        </div>
        <button onClick={() => setShowNewTicket(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />New Ticket
        </button>
      </div>

      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
          </div>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white">
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-center gap-1 mt-3 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setStatusFilter(tab)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap", statusFilter === tab ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800")}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={cn("ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold", statusFilter === tab ? "bg-blue-500/30 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300")}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((ticket) => (
          <div key={ticket.id} className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {ticket.priority === "critical" || ticket.priority === "high" ? <AlertTriangle className={cn("w-4 h-4", ticket.priority === "critical" ? "text-red-500" : "text-orange-500")} /> : <Clock className="w-4 h-4 text-yellow-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 flex-wrap mb-2">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{ticket.id}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", PRIORITY_COLORS[ticket.priority])}>{ticket.priority}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STATUS_COLORS[ticket.status])}>{ticket.status}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">{ticket.category}</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{ticket.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
                  <span>{ticket.department}</span>
                  {ticket.assignee && <span>→ {ticket.assignee}</span>}
                  <span>{formatRelativeTime(ticket.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-5">Create New Ticket</h3>
            <div className="space-y-4">
              <input placeholder="Issue title *" className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
              <textarea rows={3} placeholder="Detailed description..." className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white">
                  <option>Medium Priority</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
                <select className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white">
                  <option>General</option>
                  <option>Windows</option>
                  <option>Network</option>
                  <option>Email</option>
                  <option>Security</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewTicket(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
              <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
