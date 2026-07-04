"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Sun, Moon, Command, MessageSquare } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/chat": "AI Chat — Senior IT Engineer",
  "/dashboard/tickets": "Support Tickets",
  "/dashboard/devices": "Device Inventory",
  "/dashboard/users": "User Management",
  "/dashboard/knowledge": "Knowledge Base",
  "/dashboard/reports": "Reports & Analytics",
  "/dashboard/settings": "Settings",
};

interface HeaderProps {
  onCmdK?: () => void;
}

export function Header({ onCmdK }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30 flex-shrink-0">
      <h1 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Cmd+K trigger */}
        <button
          onClick={onCmdK}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-gray-400">Search or ask...</span>
          <span className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">
            <Command className="w-2.5 h-2.5" />K
          </span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          title="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Ask AI */}
        <button
          onClick={() => router.push("/dashboard/chat")}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25"
        >
          <MessageSquare className="w-4 h-4" />
          Ask AI
        </button>
      </div>
    </header>
  );
}
