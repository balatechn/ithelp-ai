"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Paperclip, Mic, MicOff, Copy, ThumbsUp, ThumbsDown,
  RotateCcw, Ticket, ArrowUp, Bot,
  Sparkles, Code2, FileText, AlertTriangle, Key, Wifi, Settings
} from "lucide-react";
import { cn, generateId, formatRelativeTime } from "@/lib/utils";
import { Message } from "@/types";
import { MarkdownRenderer } from "./markdown-renderer";
import { toast } from "@/components/ui/toaster";

function getFriendlyError(msg: string): { icon: string; title: string; desc: string } {
  const m = msg.toLowerCase();
  if (m.includes("api key") || m.includes("authentication") || m.includes("401") || m.includes("x-api-key"))
    return { icon: "key", title: "API key not configured", desc: "Add your Anthropic API key in Settings → AI Configuration to enable AI chat." };
  if (m.includes("rate limit") || m.includes("429"))
    return { icon: "clock", title: "Rate limit reached", desc: "Too many requests. Wait a moment and try again." };
  if (m.includes("network") || m.includes("fetch") || m.includes("failed to fetch"))
    return { icon: "wifi", title: "Connection error", desc: "Could not reach the AI service. Check your network and try again." };
  if (m.includes("timeout"))
    return { icon: "clock", title: "Request timed out", desc: "The AI took too long to respond. Try a shorter message." };
  return { icon: "alert", title: "Something went wrong", desc: msg.length < 120 ? msg : "An unexpected error occurred. Please try again." };
}

const SUGGESTED_PROMPTS = [
  { icon: AlertTriangle, text: "My computer shows Blue Screen of Death", category: "Windows" },
  { icon: Code2, text: "Generate a PowerShell script to check disk health", category: "Scripting" },
  { icon: FileText, text: "How to reset a user's password in Active Directory", category: "AD" },
  { icon: Bot, text: "Outlook not syncing emails after Office update", category: "M365" },
  { icon: Sparkles, text: "VPN keeps disconnecting randomly", category: "Network" },
  { icon: FileText, text: "How to deploy software via Intune", category: "Intune" },
];

export function ChatInterface() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      setInput(q);
      setTimeout(() => sendMessage(q), 100);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantId = generateId();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();
      const allMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "AI service error" }));
        throw new Error(errData.error || "AI service error");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullText } : m
                  )
                );
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== "JSON") throw parseErr;
            }
          }
        }
      }
    } catch (error: unknown) {
      if ((error as Error)?.name !== "AbortError") {
        const raw = (error as Error)?.message || "Unknown error";
        const friendly = getFriendlyError(raw);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "", errorMsg: friendly }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast("Copied to clipboard", "success");
  };

  const createTicket = (content: string) => {
    toast("Ticket creation coming soon!", "info");
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 neon-glow">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your AI IT Support Engineer
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
            Ask me anything about Windows, networking, Microsoft 365, Azure, security, or any IT issue.
            I can help troubleshoot, generate scripts, and create tickets.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl mb-8">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => sendMessage(prompt.text)}
                className="glass-card rounded-xl p-4 text-left hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
              >
                <prompt.icon className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{prompt.text}</p>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 mt-1 block">{prompt.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSend={() => sendMessage(input)}
          onKeyDown={handleKeyDown}
          onTextareaChange={handleTextareaChange}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          inputRef={inputRef}
          fileInputRef={fileInputRef}
          onStopGeneration={stopGeneration}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={copyMessage}
            onCreateTicket={createTicket}
            isLoading={isLoading && message.role === "assistant" && !message.content}
          />
        ))}

        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSend={() => sendMessage(input)}
        onKeyDown={handleKeyDown}
        onTextareaChange={handleTextareaChange}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        onStopGeneration={stopGeneration}
      />
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  onCreateTicket,
  isLoading,
}: {
  message: Message;
  onCopy: (content: string) => void;
  onCreateTicket: (content: string) => void;
  isLoading: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 message-enter">
        <div className="max-w-[80%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
            {formatRelativeTime(message.timestamp)}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          U
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 message-enter">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 max-w-[90%]">
        {message.errorMsg ? (
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl rounded-tl-sm px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              {message.errorMsg.icon === "key" && <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              {message.errorMsg.icon === "wifi" && <Wifi className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              {(message.errorMsg.icon === "clock" || message.errorMsg.icon === "alert") && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{message.errorMsg.title}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">{message.errorMsg.desc}</p>
              {message.errorMsg.icon === "key" && (
                <a href="/dashboard/settings" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 underline">
                  <Settings className="w-3 h-3" /> Go to Settings
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl rounded-tl-sm px-5 py-4">
            {message.content ? (
              <div className="ai-prose text-sm text-gray-800 dark:text-gray-200">
                <MarkdownRenderer content={message.content} />
              </div>
            ) : (
              <div className="flex items-center gap-1 py-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>
        )}

        {message.content && !message.errorMsg && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <p className="text-xs text-gray-400 dark:text-gray-500">{formatRelativeTime(message.timestamp)}</p>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onCopy(message.content)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Helpful">
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Not helpful">
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onCreateTicket(message.content)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
              >
                <Ticket className="w-3.5 h-3.5" />
                Create Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatInput({
  input, setInput, isLoading, onSend, onKeyDown, onTextareaChange,
  isRecording, setIsRecording, inputRef, fileInputRef, onStopGeneration
}: {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onStopGeneration: () => void;
}) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative glass-card rounded-2xl overflow-hidden">
          <div className="flex items-end gap-2 p-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.txt,.log" />

            <textarea
              ref={inputRef}
              value={input}
              onChange={onTextareaChange}
              onKeyDown={onKeyDown}
              placeholder="Ask about Windows, networking, Microsoft 365, security, or any IT issue..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 max-h-48 py-2"
            />

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  isRecording
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse"
                    : "text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {isLoading ? (
                <button
                  onClick={onStopGeneration}
                  className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  title="Stop generation"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onSend}
                  disabled={!input.trim()}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    input.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  )}
                  title="Send (Enter)"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-2">
          AI can make mistakes. Verify critical procedures. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
