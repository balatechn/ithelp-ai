"use client";

import { useState } from "react";
import { Search, Plus, Users, Shield, Clock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const USERS = [
  { id: "USR-001", name: "Sarah Chen", email: "s.chen@company.com", role: "user", department: "Finance", status: "active", lastLogin: "Online now", tickets: 12 },
  { id: "USR-002", name: "Mike Johnson", email: "m.johnson@company.com", role: "user", department: "Sales", status: "active", lastLogin: "2 hours ago", tickets: 8 },
  { id: "USR-003", name: "John Smith", email: "j.smith@company.com", role: "engineer", department: "IT", status: "active", lastLogin: "Online now", tickets: 47 },
  { id: "USR-004", name: "Emily Davis", email: "e.davis@company.com", role: "engineer", department: "IT", status: "active", lastLogin: "Online now", tickets: 62 },
  { id: "USR-005", name: "Tom Wilson", email: "t.wilson@company.com", role: "user", department: "HR", status: "active", lastLogin: "Yesterday", tickets: 5 },
  { id: "USR-006", name: "Anna Lee", email: "a.lee@company.com", role: "engineer", department: "IT", status: "active", lastLogin: "Online now", tickets: 39 },
  { id: "USR-007", name: "Mark Chen", email: "m.chen@company.com", role: "user", department: "Marketing", status: "inactive", lastLogin: "1 week ago", tickets: 3 },
  { id: "USR-008", name: "IT Admin", email: "admin@company.com", role: "admin", department: "IT", status: "active", lastLogin: "Online now", tickets: 156 },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  engineer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  user: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{USERS.length} users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />Add User
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: USERS.length, icon: Users, color: "text-blue-500" },
          { label: "Engineers", value: USERS.filter((u) => u.role === "engineer" || u.role === "admin").length, icon: Shield, color: "text-purple-500" },
          { label: "Active Now", value: 5, icon: Clock, color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <s.icon className={cn("w-8 h-8", s.color)} />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {["User", "Role", "Department", "Last Login", "Tickets", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", ROLE_COLORS[user.role])}>{user.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.department}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", user.lastLogin === "Online now" ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{user.lastLogin}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.tickets}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", user.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>{user.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
