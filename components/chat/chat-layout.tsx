"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, MessageSquare, Search, Pin, Trash2, ChevronLeft,
  Clock, Star, Download
} from "lucide-react";
import { cn, generateId, formatRelativeTime } from "@/lib/utils";
import { Conversation } from "@/types";
import { ChatInterface } from "./chat-interface";

const SAMPLE_HISTORY: Conversation[] = [
  {
    id: "conv-1",
    title: "Outlook not opening after update",
    messages: [],
    createdAt: new Date(Date.now() - 2 * 3600000),
    updatedAt: new Date(Date.now() - 2 * 3600000),
    pinned: true,
  },
  {
    id: "conv-2",
    title: "VPN certificate renewal steps",
    messages: [],
    createdAt: new Date(Date.now() - 24 * 3600000),
    updatedAt: new Date(Date.now() - 24 * 3600000),
    pinned: false,
  },
  {
    id: "conv-3",
    title: "BSOD MEMORY_MANAGEMENT fix",
    messages: [],
    createdAt: new Date(Date.now() - 48 * 3600000),
    updatedAt: new Date(Date.now() - 48 * 3600000),
    pinned: false,
  },
  {
    id: "conv-4",
    title: "PowerShell disk health script",
    messages: [],
    createdAt: new Date(Date.now() - 72 * 3600000),
    updatedAt: new Date(Date.now() - 72 * 3600000),
    pinned: false,
  },
];

export function ChatLayout() {
  const searchParams = useSearchParams();
  const [historyOpen, setHistoryOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_HISTORY);
  const [activeConvId, setActiveConvId] = useState<string>("new");
  const [searchHist, setSearchHist] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchHist.toLowerCase())
  );
  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  const newChat = () => setActiveConvId("new");

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* History Sidebar */}
      <div className={cn(
        "flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 overflow-hidden",
        historyOpen ? "w-72" : "w-0"
      )}>
        <div className="p-3 space-y-2 flex-shrink-0">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={searchHist}
              onChange={(e) => setSearchHist(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 px-1">
                <Pin className="w-3 h-3" /> Pinned
              </div>
              {pinned.map((conv) => (
                <ConvItem key={conv.id} conv={conv} active={activeConvId === conv.id} onClick={() => setActiveConvId(conv.id)} />
              ))}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 px-1">
              <Clock className="w-3 h-3" /> Recent
            </div>
            {recent.map((conv) => (
              <ConvItem key={conv.id} conv={conv} active={activeConvId === conv.id} onClick={() => setActiveConvId(conv.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setHistoryOpen(!historyOpen)}
        className="absolute left-[17rem] top-1/2 -translate-y-1/2 z-10 w-5 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg text-gray-400 hover:text-blue-500 transition-colors shadow-sm"
        style={{ left: historyOpen ? "calc(256px + 288px)" : "calc(256px)" }}
        title={historyOpen ? "Hide history" : "Show history"}
      >
        <ChevronLeft className={cn("w-3 h-3 transition-transform", !historyOpen && "rotate-180")} />
      </button>

      {/* Main chat area */}
      <div className="flex-1 min-w-0">
        <ChatInterface key={activeConvId} />
      </div>
    </div>
  );
}

function ConvItem({ conv, active, onClick }: { conv: Conversation; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-xl transition-all group flex items-start gap-2",
        active
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          : "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}
    >
      <MessageSquare className={cn("w-4 h-4 flex-shrink-0 mt-0.5", active ? "text-blue-500" : "text-gray-400")} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-medium truncate", active ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300")}>
          {conv.title}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
          {formatRelativeTime(conv.updatedAt)}
        </p>
      </div>
      {conv.pinned && <Star className="w-3 h-3 text-yellow-500 flex-shrink-0 fill-current" />}
    </button>
  );
}
