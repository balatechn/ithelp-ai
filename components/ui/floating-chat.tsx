"use client";

import { usePathname, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

export function FloatingChatButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on chat page or landing page
  if (pathname === "/dashboard/chat" || pathname === "/") return null;

  return (
    <button
      onClick={() => router.push("/dashboard/chat")}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 neon-glow"
      title="Open AI Chat"
    >
      <MessageSquare className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
    </button>
  );
}
