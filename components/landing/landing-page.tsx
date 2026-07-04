"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Monitor, Wifi, Printer, Mail, Key, UserCheck, Download,
  TicketIcon, Activity, Users, Zap, Shield, Clock, TrendingUp,
  ChevronRight, Star, ArrowRight, Bot, Cpu, Globe, Lock,
  Moon, Sun, MessageSquare
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const EXAMPLE_QUERIES = [
  "My laptop is running slow",
  "Outlook not opening",
  "VPN not connecting",
  "Printer is offline",
  "Forgot my password",
  "Teams audio not working",
  "Blue screen error",
  "Can't access shared drive",
];

const QUICK_ACTIONS = [
  { icon: Key, label: "Reset Password", color: "from-blue-500 to-blue-600", desc: "Self-service password reset" },
  { icon: UserCheck, label: "Unlock Account", color: "from-purple-500 to-purple-600", desc: "AD account unlock" },
  { icon: Download, label: "Install Software", color: "from-green-500 to-green-600", desc: "Request software install" },
  { icon: TicketIcon, label: "Raise Ticket", color: "from-orange-500 to-orange-600", desc: "Create support ticket" },
  { icon: Wifi, label: "Network Issue", color: "from-cyan-500 to-cyan-600", desc: "WiFi & VPN support" },
  { icon: Printer, label: "Printer Issue", color: "from-pink-500 to-pink-600", desc: "Printer troubleshooting" },
  { icon: Mail, label: "Email Issue", color: "from-indigo-500 to-indigo-600", desc: "Outlook & Exchange" },
  { icon: Monitor, label: "Device Issue", color: "from-teal-500 to-teal-600", desc: "Hardware & OS support" },
];

const STATS = [
  { label: "Resolved Today", value: "247", icon: Activity, color: "text-green-500" },
  { label: "Open Tickets", value: "18", icon: TicketIcon, color: "text-blue-500" },
  { label: "Avg Response", value: "< 2 min", icon: Clock, color: "text-purple-500" },
  { label: "AI Success Rate", value: "94%", icon: TrendingUp, color: "text-orange-500" },
];

const FEATURES = [
  { icon: Bot, title: "AI-Powered Responses", desc: "Senior IT engineer-level answers powered by Claude AI" },
  { icon: Zap, title: "Instant Resolution", desc: "Most issues resolved in under 2 minutes" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant with Azure AD SSO" },
  { icon: Globe, title: "24/7 Availability", desc: "Always-on support for your entire organization" },
  { icon: Cpu, title: "Smart Diagnostics", desc: "Analyze screenshots, logs, and error codes" },
  { icon: Lock, title: "Role-Based Access", desc: "Granular permissions for IT teams" },
];

const RECENT_ISSUES = [
  { title: "Windows Update stuck at 99%", time: "2 min ago", status: "resolved", category: "Windows" },
  { title: "Outlook profile corruption", time: "15 min ago", status: "in-progress", category: "Email" },
  { title: "VPN certificate expired", time: "1 hr ago", status: "resolved", category: "Network" },
  { title: "Teams microphone not detected", time: "2 hr ago", status: "resolved", category: "Teams" },
];

export function LandingPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(EXAMPLE_QUERIES[0]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => {
        const next = (i + 1) % EXAMPLE_QUERIES.length;
        setPlaceholder(EXAMPLE_QUERIES[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targets = [247, 18, 120, 94];
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedStats(targets.map((t) => Math.min(Math.round((t * step) / steps), t)));
      if (step >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/chat?q=${encodeURIComponent(query)}`);
    }
  };

  const handleQuickAction = (action: string) => {
    router.push(`/dashboard/chat?q=${encodeURIComponent(action)}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">ITHelp</span>
              <span className="font-bold text-lg gradient-text">AI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <button onClick={() => router.push("/dashboard")} className="hover:text-blue-600 transition-colors">Dashboard</button>
            <button onClick={() => router.push("/dashboard/tickets")} className="hover:text-blue-600 transition-colors">Tickets</button>
            <button onClick={() => router.push("/dashboard/knowledge")} className="hover:text-blue-600 transition-colors">Knowledge Base</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25"
            >
              Open Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient opacity-5 dark:opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-medium mb-8 fade-in">
              <Zap className="w-4 h-4" />
              Powered by Claude AI & Enterprise Intelligence
              <Star className="w-4 h-4 fill-current" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 slide-up leading-tight">
              Your AI{" "}
              <span className="gradient-text">IT Support</span>
              <br />
              Engineer
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed fade-in">
              Instant answers, automated resolutions, and intelligent ticket management for your entire IT infrastructure.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-opacity" />
                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                  <Search className="w-5 h-5 text-gray-400 ml-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Ask anything... e.g. "${placeholder}"`}
                    className="flex-1 px-4 py-5 text-base bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="m-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ask AI
                  </button>
                </div>
              </div>
            </form>

            {/* Example chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {EXAMPLE_QUERIES.slice(0, 6).map((q) => (
                <button
                  key={q}
                  onClick={() => router.push(`/dashboard/chat?q=${encodeURIComponent(q)}`)}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                  <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {i === 2 ? "< 2 min" : i === 3 ? `${animatedStats[i]}%` : animatedStats[i]}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <p className="text-gray-600 dark:text-gray-400">Common IT requests resolved instantly</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label)}
                className="group glass-card rounded-2xl p-6 text-left hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg",
                  action.color,
                  "group-hover:scale-110 transition-transform duration-200"
                )}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 mt-2 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues & Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Recent Issues */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Issues</h2>
              <div className="space-y-3">
                {RECENT_ISSUES.map((issue) => (
                  <div key={issue.title} className="glass-card rounded-xl p-4 flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      issue.status === "resolved" ? "bg-green-500" : "bg-blue-500 animate-pulse"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{issue.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{issue.time} · {issue.category}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
                      issue.status === "resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      {issue.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Enterprise Features</h2>
              <div className="grid grid-cols-2 gap-4">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="glass-card rounded-xl p-4">
                    <feature.icon className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your IT support?</h2>
          <p className="text-blue-200 mb-8">Join thousands of IT teams who resolved support faster with AI</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-semibold rounded-2xl hover:bg-blue-50 transition-colors shadow-2xl text-lg"
          >
            <Bot className="w-6 h-6" />
            Open IT Support Portal
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">ITHelp AI</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">— Enterprise IT Support Portal</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>© 2024 ITHelp AI</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
