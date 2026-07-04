"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MessageSquare, Ticket, Monitor, Users, BookOpen,
  BarChart2, Settings, LayoutDashboard, ArrowRight, Zap,
  Key, UserCheck, Download, Wifi, Printer, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

type CommandItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  shortcut?: string;
  query?: string;
};

const COMMANDS: { section: string; items: CommandItem[] }[] = [
  { section: "Navigation", items: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", shortcut: "G D" },
    { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat", shortcut: "G C" },
    { icon: Ticket, label: "Tickets", href: "/dashboard/tickets", shortcut: "G T" },
    { icon: Monitor, label: "Devices", href: "/dashboard/devices", shortcut: "G V" },
    { icon: Users, label: "Users", href: "/dashboard/users", shortcut: "G U" },
    { icon: BookOpen, label: "Knowledge Base", href: "/dashboard/knowledge", shortcut: "G K" },
    { icon: BarChart2, label: "Reports", href: "/dashboard/reports", shortcut: "G R" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", shortcut: "G S" },
  ]},
  { section: "Quick Actions", items: [
    { icon: Key, label: "Reset Password", query: "How to reset a user password in Active Directory" },
    { icon: UserCheck, label: "Unlock AD Account", query: "How to unlock a locked Active Directory account" },
    { icon: Download, label: "Install Software via Intune", query: "How to deploy software via Microsoft Intune" },
    { icon: Wifi, label: "Troubleshoot VPN", query: "VPN not connecting, how to fix" },
    { icon: Printer, label: "Fix Printer Offline", query: "Printer showing offline, how to fix" },
    { icon: Mail, label: "Fix Outlook Issues", query: "Outlook not working, troubleshooting steps" },
    { icon: Zap, label: "Generate PowerShell Script", query: "Generate a PowerShell diagnostic script for Windows" },
  ]},
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems: CommandItem[] = COMMANDS.flatMap((s) => s.items);
  const filtered = query
    ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const execute = (item: CommandItem) => {
    onClose();
    if ("href" in item && item.href) {
      router.push(item.href);
    } else if ("query" in item && item.query) {
      router.push(`/dashboard/chat?q=${encodeURIComponent(item.query)}`);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[selected]) { execute(filtered[selected] as CommandItem); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, filtered]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search pages, actions, or ask AI..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder-gray-400"
          />
          <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto py-2">
          {query && (
            <button
              onClick={() => { onClose(); router.push(`/dashboard/chat?q=${encodeURIComponent(query)}`); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-900 dark:text-white">Ask AI: </span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{query}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {(query ? [{ section: "Results", items: filtered }] : COMMANDS).map((section) => (
            <div key={section.section}>
              <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.section}
              </div>
              {section.items.map((item, i) => {
                const globalIdx = filtered.indexOf(item as typeof filtered[0]);
                const isSelected = selected === globalIdx;
                return (
                  <button
                    key={item.label}
                    onClick={() => execute(item)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left",
                      isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <item.icon className={cn("w-4 h-4", isSelected ? "text-blue-500" : "text-gray-500 dark:text-gray-400")} />
                    </div>
                    <span className={cn("flex-1 text-sm", isSelected ? "text-blue-700 dark:text-blue-300 font-medium" : "text-gray-700 dark:text-gray-300")}>
                      {item.label}
                    </span>
                    {"shortcut" in item && item.shortcut && (
                      <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">{item.shortcut}</kbd>
                    )}
                    {"query" in item && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">AI</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-[10px] text-gray-400">
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">↵</kbd> select</span>
          <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
