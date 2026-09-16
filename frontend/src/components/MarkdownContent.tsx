import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  compact?: boolean;
  className?: string;
}

export function MarkdownContent({ content, compact = false, className }: MarkdownContentProps) {
  const markdownComponents: Components = {
    p: ({ children }) => (
      <p className={cn("whitespace-pre-wrap text-inherit", compact ? "text-sm leading-relaxed" : "text-base leading-7")}>{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className={cn("font-semibold tracking-tight text-foreground", compact ? "text-base" : "text-3xl")}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className={cn("font-semibold tracking-tight text-foreground", compact ? "text-sm" : "text-2xl")}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-xl")}>{children}</h3>
    ),
    ul: ({ children }) => (
      <ul className={cn("list-disc pl-5 text-inherit", compact ? "space-y-1 text-sm" : "space-y-2 text-base")}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={cn("list-decimal pl-5 text-inherit", compact ? "space-y-1 text-sm" : "space-y-2 text-base")}>{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7 text-inherit">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">{children}</blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic text-inherit">{children}</em>,
    a: ({ href, children }) => {
      let safeHref = href;
      if (href) {
        try {
          const url = new URL(href, window.location.origin);
          if (!["http:", "https:", "mailto:"].includes(url.protocol)) {
            safeHref = "#";
          }
        } catch {
          // Fallback if unparseable
          safeHref = "#";
        }
      }
      return (
        <a
          href={safeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => {
      const text = String(children);
      const isBlock = text.includes("\n");

      return isBlock ? (
        <code className="block overflow-x-auto rounded-xl bg-muted p-4 font-mono text-sm text-foreground">{children}</code>
      ) : (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">{children}</code>
      );
    },
    pre: ({ children }) => (
      <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-sm text-foreground">{children}</pre>
    ),
    hr: () => <hr className="my-4 border-border" />,
  };

  const cleanContent = (content || "")
    .replace(/\\+(\s*\r?\n)/g, "$1")
    .replace(/\\+\s*$/gm, "");

  return (
    <div className={cn("markdown-content", compact && "line-clamp-3 overflow-hidden", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}