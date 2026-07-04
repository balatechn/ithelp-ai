"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Ticket, Monitor, Users,
  BookOpen, BarChart2, Settings, Bot, ChevronLeft, ChevronRight,
  Zap, Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
  { icon: Ticket, label: "Tickets", href: "/dashboard/tickets" },
  { icon: Monitor, label: "Devices", href: "/dashboard/devices" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: BookOpen, label: "Knowledge Base", href: "/dashboard/knowledge" },
  { icon: BarChart2, label: "Reports", href: "/dashboard/reports" },
  { icon: Zap, label: "Automation", href: "/dashboard/automation" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className={cn(
      "sticky top-0 h-screen flex-shrink-0 flex flex-col",
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
      "transition-all duration-300 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <div className="font-bold text-gray-900 dark:text-white leading-tight">
              ITHelp<span className="gradient-text">AI</span>
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">IT SUPPORT PORTAL</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn("sidebar-item", active && "active")}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === "AI Chat" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <Wifi className="w-4 h-4 text-green-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-green-700 dark:text-green-400">AI Online</div>
              <div className="text-[10px] text-green-600 dark:text-green-500">Claude · Gemini</div>
            </div>
          </div>
        )}

        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            IT
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">IT Admin</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@company.com</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
