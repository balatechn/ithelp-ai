"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langColors: Record<string, string> = {
    powershell: "from-blue-900 to-blue-950",
    ps1: "from-blue-900 to-blue-950",
    cmd: "from-gray-800 to-gray-900",
    bash: "from-gray-800 to-gray-900",
    python: "from-yellow-900 to-yellow-950",
    sql: "from-green-900 to-green-950",
    javascript: "from-yellow-800 to-yellow-900",
    typescript: "from-blue-800 to-blue-900",
  };

  const langLabels: Record<string, string> = {
    powershell: "PowerShell",
    ps1: "PowerShell",
    cmd: "CMD",
    bash: "Bash",
    python: "Python",
    sql: "SQL",
    javascript: "JavaScript",
    typescript: "TypeScript",
  };

  const bg = langColors[language?.toLowerCase()] || "from-gray-800 to-gray-900";
  const label = langLabels[language?.toLowerCase()] || language || "Code";

  return (
    <div className="rounded-xl overflow-hidden my-3 shadow-lg border border-gray-700/50">
      <div className={`flex items-center justify-between px-4 py-2 bg-gradient-to-r ${bg}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-medium text-gray-300 ml-1">{label}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-950 overflow-x-auto p-4 text-sm">
        <code className="text-gray-200 font-mono">{children}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2 flex items-center gap-2">{children}</h2>
        ),
        h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3 mb-1">{children}</h3>,
        p: ({ children }) => <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-200">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-sm text-gray-800 dark:text-gray-200">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 my-3 text-gray-600 dark:text-gray-400 italic">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-gray-200 dark:border-gray-700 my-4" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white text-xs uppercase">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{children}</td>,
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const isBlock = match || (typeof children === "string" && children.includes("\n"));

          if (isBlock && match) {
            return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>;
          }

          return (
            <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
