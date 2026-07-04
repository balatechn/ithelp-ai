"use client";

import { useState } from "react";
import { Search, BookOpen, Star, Eye, Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const ARTICLES = [
  { id: "KB-001", title: "How to Fix Outlook Profile Corruption", category: "Microsoft 365", views: 1240, rating: 4.8, tags: ["outlook", "email", "profile"], updated: "2 days ago", featured: true },
  { id: "KB-002", title: "VPN Certificate Renewal Step-by-Step Guide", category: "Networking", views: 892, rating: 4.9, tags: ["vpn", "certificate", "ssl"], updated: "1 week ago", featured: true },
  { id: "KB-003", title: "Windows BSOD Troubleshooting Guide", category: "Windows", views: 3410, rating: 4.7, tags: ["bsod", "windows", "crash"], updated: "3 days ago", featured: true },
  { id: "KB-004", title: "Active Directory Password Reset Procedures", category: "Active Directory", views: 2100, rating: 4.6, tags: ["ad", "password", "reset"], updated: "5 days ago", featured: false },
  { id: "KB-005", title: "Microsoft Teams Audio Troubleshooting", category: "Microsoft 365", views: 756, rating: 4.5, tags: ["teams", "audio", "microphone"], updated: "1 day ago", featured: false },
  { id: "KB-006", title: "Printer Offline Fix — All Brands", category: "Hardware", views: 1890, rating: 4.4, tags: ["printer", "offline", "hardware"], updated: "4 days ago", featured: false },
  { id: "KB-007", title: "PowerShell Scripts for IT Automation", category: "Scripting", views: 2340, rating: 4.9, tags: ["powershell", "automation", "scripts"], updated: "2 days ago", featured: false },
  { id: "KB-008", title: "Sophos Firewall Rule Configuration", category: "Security", views: 634, rating: 4.6, tags: ["sophos", "firewall", "security"], updated: "1 week ago", featured: false },
];

const CATEGORIES = ["Windows", "Microsoft 365", "Networking", "Security", "Active Directory", "Hardware", "Linux", "Scripting"];

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = ARTICLES.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Knowledge Base</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">199 articles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />New Article
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles, guides, procedures..." className="w-full pl-12 pr-4 py-4 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-blue-500 text-gray-900 dark:text-white shadow-sm" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto mb-8 pb-1">
        <button onClick={() => setActiveCategory("all")} className={cn("px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all", activeCategory === "all" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300")}>
          All Articles
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all", activeCategory === cat ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300")}>
            {cat}
          </button>
        ))}
      </div>

      {activeCategory === "all" && !search && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">⭐ Featured Articles</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {ARTICLES.filter((a) => a.featured).map((article) => (
              <div key={article.id} className="glass-card rounded-2xl p-5 card-hover cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{article.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />{article.rating}
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 leading-snug">{article.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views.toLocaleString()}</span>
                  <span>{article.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((article) => (
          <div key={article.id} className="glass-card rounded-xl p-4 flex items-center gap-4 card-hover cursor-pointer">
            <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">{article.id}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{article.category}</span>
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{article.title}</h4>
              <div className="flex items-center gap-3 mt-1">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="flex items-center gap-0.5 text-[10px] text-blue-500 dark:text-blue-400">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 flex-shrink-0">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{article.views.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" />{article.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
