"use client";

import { useState } from "react";
import { Bot, Key, Bell, Palette, Save, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk-ant-...");
  const [aiModel, setAiModel] = useState("claude-sonnet-4-5");
  const [notifications, setNotifications] = useState({ email: true, browser: true, teams: false, slack: false });

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Configure your IT Support Portal</p>
      </div>

      {/* AI Config */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20"><Bot className="w-5 h-5 text-blue-500" /></div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Configuration</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Configure AI models and behavior</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Primary AI Model</label>
          <select value={aiModel} onChange={(e) => setAiModel(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 text-gray-900 dark:text-white">
            <option value="claude-sonnet-4-5">Claude Sonnet 4.5 (Recommended)</option>
            <option value="claude-opus-4-5">Claude Opus 4.5 (Most Capable)</option>
            <option value="claude-haiku-4-5">Claude Haiku 4.5 (Fastest)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Anthropic API Key</label>
          <div className="flex items-center gap-2 w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type={showApiKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white font-mono text-xs" placeholder="sk-ant-..." />
            <button onClick={() => setShowApiKey(!showApiKey)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set via ANTHROPIC_API_KEY environment variable for production</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20"><Palette className="w-5 h-5 text-purple-500" /></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Appearance</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ].map((t) => (
            <button key={t.value} onClick={() => setTheme(t.value as "light" | "dark" | "system")} className={cn("p-3 rounded-xl border-2 text-center transition-all", theme === t.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300")}>
              <div className={cn("w-full h-8 rounded-lg mb-2", t.value === "light" ? "bg-white border border-gray-200" : t.value === "dark" ? "bg-gray-900" : "bg-gradient-to-r from-white to-gray-900")} />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20"><Bell className="w-5 h-5 text-orange-500" /></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{key} Notifications</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{key === "email" ? "Critical tickets via email" : key === "browser" ? "Browser push notifications" : key === "teams" ? "Microsoft Teams alerts" : "Slack alerts"}</div>
              </div>
              <button onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))} className={cn("w-10 h-6 rounded-full relative transition-colors", value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600")}>
                <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", value ? "right-1" : "left-1")} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25">
        <Save className="w-4 h-4" />Save Settings
      </button>
    </div>
  );
}
