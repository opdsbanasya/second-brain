import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  LoaderCircle,
  Video,
  Share2,
  Trash,
  Check,
  Save,
  BookOpen,
  Music,
  Film,
  Globe,
  Tag as TagIcon,
  Download,
  ChevronDown,
  FileCode,
  MoreVertical
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useContentActions } from "@/hooks/useContentActions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

type Content = {
  _id: string;
  title: string;
  description?: string;
  link?: string;
  contentType: string;
  tags?: string[];
  createdAt: string;
};

function getContentIcon(contentType: string) {
  switch (contentType) {
    case "video":
      return Video;
    case "link":
      return LinkIcon;
    case "article":
      return BookOpen;
    case "podcast":
      return Music;
    case "course":
      return Film;
    case "other":
      return Globe;
    default:
      return FileText;
  }
}

const cleanMarkdown = (text?: string) =>
  (text || "")
    .replace(/\\+(\s*\r?\n)/g, "$1")
    .replace(/\\+\s*$/gm, "");

export default function ContentDetailPage() {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [initialContent, setInitialContent] = useState<Content | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  // BlockNote Editor Instance with direct markdown parsing on paste
  const editor = useCreateBlockNote({
    pasteHandler: ({ event, editor, defaultPasteHandler }) => {
      // 1. If currently inside a code block, let default handler paste raw text
      const isInCodeBlock = editor.transact(
        (tr) =>
          Boolean(
            tr.selection.$from.parent.type.spec.code &&
              tr.selection.$to.parent.type.spec.code
          )
      );
      if (isInCodeBlock) {
        return defaultPasteHandler();
      }

      const text = event.clipboardData?.getData("text/plain");
      if (text) {
        const normalized = cleanMarkdown(text.replace(/\r\n/g, "\n"));
        // Check if the pasted text contains markdown structures (code blocks, headings, lists, blockquotes, tables)
        const hasMarkdownIndicators =
          /(^|\n)\s*(```|~~~|#{1,6}\s+|[-*+]\s+|\d+\.\s+|>|\|.+\|)/m.test(normalized);

        if (hasMarkdownIndicators) {
          const parsedBlocks = editor.tryParseMarkdownToBlocks(normalized);
          if (
            parsedBlocks &&
            parsedBlocks.length > 0 &&
            (parsedBlocks.length > 1 || parsedBlocks[0].type !== "paragraph")
          ) {
            const cursor = editor.getTextCursorPosition();
            const currentBlock = cursor?.block;

            const isCurrentBlockEmpty =
              !currentBlock?.content ||
              (Array.isArray(currentBlock.content) &&
                (currentBlock.content.length === 0 ||
                  currentBlock.content.every(
                    (c: any) => c.type === "text" && !c.text.trim()
                  )));

            let insertedBlocks: any[] = [];
            if (currentBlock) {
              if (isCurrentBlockEmpty) {
                insertedBlocks = editor.replaceBlocks([currentBlock], parsedBlocks as any).insertedBlocks;
              } else {
                insertedBlocks = editor.insertBlocks(parsedBlocks as any, currentBlock, "after");
              }
            } else {
              insertedBlocks = editor.replaceBlocks(editor.document, parsedBlocks as any).insertedBlocks;
            }

            if (insertedBlocks && insertedBlocks.length > 0) {
              const lastBlock = insertedBlocks[insertedBlocks.length - 1];
              try {
                editor.setTextCursorPosition(lastBlock, "end");
              } catch {
                /* cursor set fallback */
              }
            }

            const updatedMd = editor.blocksToMarkdownLossy(editor.document);
            setDescription(cleanMarkdown(updatedMd));
            return true;
          }
        }
      }

      return defaultPasteHandler({
        prioritizeMarkdownOverHTML: true,
        plainTextAsMarkdown: true,
      });
    },
  });
  const initialLoadedRef = useRef(false);

  // Save Status
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const { handleShare, handleDelete } = useContentActions();

  const fetchContent = () => {
    if (!contentId) return;
    setLoading(true);
    api
      .get(`/content/${encodeURIComponent(contentId)}`)
      .then(({ data }) => {
        const item: Content = data.content;
        setInitialContent(item);
        setTitle(item.title || "");
        setDescription(item.description || "");
        setLink(item.link || "");
        setHasChanges(false);
        setIsSaved(true);

        // Populate BlockNote Editor
        const descText = cleanMarkdown(item.description || "");
        const blocks = descText.trim()
          ? editor.tryParseMarkdownToBlocks(descText)
          : [{ type: "paragraph" as const }];
        editor.replaceBlocks(editor.document, blocks);
        initialLoadedRef.current = true;
      })
      .catch((requestError) =>
        setError(
          requestError.response?.status === 404
            ? "Invalid content. You do not have access to this item."
            : "We could not load this content."
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  // Track Unsaved Changes
  useEffect(() => {
    if (!initialContent || !initialLoadedRef.current) return;

    const changed =
      title !== initialContent.title ||
      description !== (initialContent.description || "") ||
      link !== (initialContent.link || "");

    setHasChanges(changed);
    if (changed) setIsSaved(false);
  }, [title, description, link, initialContent]);

  // Save Function
  const handleSave = async () => {
    if (!contentId || !title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      const cleanedDescription = cleanMarkdown(description.trim());
      const { data } = await api.put(`/content/${encodeURIComponent(contentId)}`, {
        title: title.trim(),
        description: cleanedDescription,
        link: link.trim() || undefined,
      });

      const updated: Content = data.content;
      setInitialContent(updated);
      setHasChanges(false);
      setIsSaved(true);
      toast.success("Changes saved successfully!");
    } catch (err: any) {
      toast.error("Failed to save changes", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (hasChanges && !isSaving) {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasChanges, isSaving, title, description, link]);

  const exportAsMarkdown = () => {
    try {
      const docMarkdown = editor ? editor.blocksToMarkdownLossy(editor.document) : description;
      const cleanDocMarkdown = cleanMarkdown(docMarkdown);

      let md = `# ${title || "Untitled"}\n\n`;
      if (initialContent?.contentType) {
        md += `> **Type:** ${initialContent.contentType}\n`;
      }
      if (link) {
        md += `> **Link:** ${link}\n`;
      }
      if (initialContent?.tags && initialContent.tags.length > 0) {
        md += `> **Tags:** ${initialContent.tags.map((t) => `#${t}`).join(" ")}\n`;
      }
      md += `\n---\n\n${cleanDocMarkdown}\n`;

      const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      const safeTitle = (title || "document")
        .trim()
        .replace(/[^a-zA-Z0-9_\-\s]/g, "")
        .replace(/\s+/g, "_");
      anchor.download = `${safeTitle || "document"}.md`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);
      toast.success("Document exported as Markdown (.md)");
    } catch (error) {
      toast.error("Failed to export Markdown document");
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const exportClientSidePdf = () => {
    try {
      const editorHtml = editor ? editor.blocksToFullHTML(editor.document) : "";
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked. Please allow popups to export PDF.", { id: "export-pdf" });
        return;
      }

      const safeTitle = (title || "document").trim();

      const docHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${safeTitle}</title>
    <style>
      @page {
        size: A4;
        margin: 20mm 18mm;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #0f172a;
        line-height: 1.65;
        padding: 0;
        margin: 0 auto;
        max-width: 800px;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      h1 {
        font-size: 24pt;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 12px 0;
        line-height: 1.25;
      }
      .meta-box {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
        font-size: 10pt;
        color: #64748b;
      }
      .meta-row {
        margin: 4px 0;
      }
      .tag-badge {
        display: inline-block;
        background: #f1f5f9;
        color: #334155;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 9pt;
        font-weight: 500;
        margin-right: 6px;
        margin-bottom: 4px;
      }
      a {
        color: #2563eb;
        text-decoration: underline;
      }
      pre {
        background: #0f172a !important;
        color: #f8fafc !important;
        border-radius: 8px;
        padding: 14px 18px;
        margin: 16px 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        font-size: 9.5pt;
        line-height: 1.6;
        overflow-x: auto;
        page-break-inside: avoid;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 9.5pt;
      }
      :not(pre) > code {
        background: #f1f5f9;
        color: #0f172a;
        padding: 2px 6px;
        border-radius: 4px;
      }
      blockquote {
        border-left: 3px solid #cbd5e1;
        background: #f8fafc;
        margin: 14px 0;
        padding: 8px 14px;
        color: #475569;
        font-style: italic;
        border-radius: 0 4px 4px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        page-break-inside: avoid;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 8px 12px;
        text-align: left;
      }
      th {
        background: #f8fafc;
        font-weight: 600;
      }
      @media print {
        body {
          max-width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <h1>${safeTitle}</h1>
    <div class="meta-box">
      ${initialContent?.contentType ? `<div class="meta-row"><strong>Type:</strong> ${initialContent.contentType}</div>` : ""}
      ${link ? `<div class="meta-row"><strong>Link:</strong> <a href="${link}">${link}</a></div>` : ""}
      ${
        initialContent?.tags && initialContent.tags.length > 0
          ? `<div class="meta-row" style="margin-top: 8px;">${initialContent.tags
              .map((t) => `<span class="tag-badge">#${t}</span>`)
              .join(" ")}</div>`
          : ""
      }
    </div>
    <div class="content">
      ${editorHtml}
    </div>
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.focus();
          window.print();
        }, 300);
      };
    </script>
  </body>
</html>`;

      printWindow.document.open();
      printWindow.document.write(docHtml);
      printWindow.document.close();
      toast.success("Print dialog opened. Select 'Save as PDF'", { id: "export-pdf" });
    } catch (err: any) {
      console.error("Browser print-to-PDF error:", err);
      toast.error("Failed to generate PDF", {
        id: "export-pdf",
        description: err.message || "Could not open print window",
      });
    }
  };

  const exportAsPdf = async () => {
    if (isExportingPdf || !contentId) return;
    try {
      if (hasChanges) {
        await handleSave();
      }

      setIsExportingPdf(true);
      toast.loading("Generating PDF...", { id: "export-pdf" });

      const response = await api.get("/content/export-pdf", {
        params: { contentId },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      const safeTitle = (title || "document")
        .trim()
        .replace(/[^a-zA-Z0-9_\-\s]/g, "")
        .replace(/\s+/g, "_");
      anchor.download = `${safeTitle || "document"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);

      toast.success("PDF downloaded successfully!", { id: "export-pdf" });
    } catch (error: any) {
      console.warn("Server PDF export failed (e.g. production serverless/Railway without Chromium), falling back to browser print-to-PDF:", error);
      exportClientSidePdf();
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (error)
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Content unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block text-sm font-medium text-primary"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );

  if (loading || !initialContent)
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
    );

  const Icon = getContentIcon(initialContent.contentType);

  return (
    <main className="min-h-screen bg-background px-2.5 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Navigation & Action Header */}
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          {/* Action & Save Status Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Save Status & Button */}
            {isSaving ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2 sm:px-2.5 py-1 rounded-full">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="hidden xs:inline sm:inline">Saving...</span>
              </span>
            ) : hasChanges ? (
              <Button
                size="sm"
                onClick={handleSave}
                className="h-7 sm:h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 px-2 sm:px-3"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
                <span className="hidden sm:inline">Changes</span>
              </Button>
            ) : isSaved ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 rounded-full">
                <Check className="h-3.5 w-3.5" />
                <span className="hidden xs:inline sm:inline">Saved</span>
              </span>
            ) : null}

            {/* Desktop Actions (Medium & Large screens) */}
            <div className="hidden md:flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare({ id: contentId! })}
                className="h-8 gap-1.5 text-xs hover:text-primary"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={exportAsPdf}
                    disabled={isExportingPdf}
                    className="flex items-center gap-2.5 cursor-pointer py-2 text-xs"
                  >
                    {isExportingPdf ? (
                      <LoaderCircle className="h-4 w-4 animate-spin text-rose-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-rose-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {isExportingPdf ? "Generating PDF..." : "Export as PDF"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Direct download .pdf</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportAsMarkdown}
                    className="flex items-center gap-2.5 cursor-pointer py-2 text-xs"
                  >
                    <FileCode className="h-4 w-4 text-blue-500" />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">Export as Markdown</span>
                      <span className="text-[10px] text-muted-foreground">Direct download .md</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const deleted = await handleDelete({ id: contentId! });
                  if (deleted) navigate("/dashboard");
                }}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>

            {/* Mobile Three-Dot Menu (Below md screens) */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                    aria-label="Options menu"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1">
                  <DropdownMenuItem
                    onClick={() => handleShare({ id: contentId! })}
                    className="flex items-center gap-2.5 cursor-pointer py-2 text-xs"
                  >
                    <Share2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">Share Document</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={exportAsPdf}
                    disabled={isExportingPdf}
                    className="flex items-center gap-2.5 cursor-pointer py-2 text-xs"
                  >
                    {isExportingPdf ? (
                      <LoaderCircle className="h-4 w-4 animate-spin text-rose-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-rose-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {isExportingPdf ? "Generating PDF..." : "Export as PDF"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Direct download .pdf</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={exportAsMarkdown}
                    className="flex items-center gap-2.5 cursor-pointer py-2 text-xs"
                  >
                    <FileCode className="h-4 w-4 text-blue-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">Export as Markdown</span>
                      <span className="text-[10px] text-muted-foreground">Direct download .md</span>
                    </div>
                  </DropdownMenuItem>

                  {link && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => window.open(link, "_blank")}
                        className="flex items-center gap-2.5 cursor-pointer py-2 text-xs"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Open Attached Link</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={async () => {
                      const deleted = await handleDelete({ id: contentId! });
                      if (deleted) navigate("/dashboard");
                    }}
                    className="flex items-center gap-2.5 cursor-pointer py-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Delete Document</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Notion-Style Document Editor Container */}
        <article className="rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3 sm:p-6 md:p-8 shadow-sm transition-all overflow-hidden">
          {/* Read-Only Type & Saved Date Badges */}
          <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground capitalize">
                <Icon className="h-3 w-3 text-primary" />
                {initialContent.contentType}
              </span>
            </div>

            <span className="text-[11px] sm:text-xs text-muted-foreground">
              Saved {new Date(initialContent.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Inline Editable Title */}
          <div className="group relative mb-2 sm:mb-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled..."
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              className="w-full resize-none border-b border-transparent bg-transparent text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-all hover:bg-accent/20 focus:border-primary/40 focus:bg-background focus:outline-none p-1 sm:p-1.5 -ml-1 rounded-lg break-words"
            />
          </div>

          {/* Properties Section (Link & Read-Only Tags) */}
          <div className="mb-4 sm:mb-6 space-y-2 rounded-lg sm:rounded-xl border border-border/50 bg-muted/20 p-2.5 sm:p-3 text-xs sm:text-sm overflow-hidden">
            {/* Link Property (Editable URL) */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
              <span className="flex w-16 sm:w-20 shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <LinkIcon className="h-3.5 w-3.5" /> Link
              </span>
              <div className="flex flex-1 items-center gap-1.5 min-w-0">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Add a link (e.g. https://example.com)..."
                  className="flex-1 min-w-0 rounded-md border border-transparent bg-transparent px-2 py-0.5 text-xs sm:text-sm text-foreground transition-all hover:bg-background/80 focus:border-border focus:bg-background focus:outline-none truncate"
                />
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground hover:bg-accent/80 transition-colors shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" /> <span className="hidden xs:inline">Open</span>
                  </a>
                )}
              </div>
            </div>

            {/* Tags Property (Read-Only Badges) */}
            {initialContent.tags && initialContent.tags.length > 0 && (
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex w-16 sm:w-20 shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <TagIcon className="h-3.5 w-3.5" /> Tags
                </span>
                <div className="flex flex-wrap gap-1 py-0.5">
                  {initialContent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent/80 px-2 py-0.5 text-[11px] font-medium text-accent-foreground select-none"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BlockNote Rich-Text Editor View (Default & Always Editable) */}
          <div className="min-h-[16rem] sm:min-h-[20rem] rounded-lg sm:rounded-xl border border-input bg-background p-0 sm:p-1 overflow-x-auto">
            <BlockNoteView
              editor={editor}
              theme="light"
              editable
              shadCNComponents={{}}
              onChange={(nextEditor) => {
                if (!initialLoadedRef.current) return;
                const markdown = nextEditor.blocksToMarkdownLossy(nextEditor.document);
                setDescription(cleanMarkdown(markdown));
              }}
              className="bn-editor-scroll h-full min-h-[14rem] sm:min-h-[16rem] w-full"
            />
          </div>
        </article>
      </div>

      <Toaster position="bottom-right" />
    </main>
  );
}
