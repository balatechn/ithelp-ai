import { Suspense } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 skeleton" />
          <div className="w-48 h-4 skeleton rounded" />
        </div>
      </div>
    }>
      <ChatLayout />
    </Suspense>
  );
}
