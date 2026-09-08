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

  // BlockNote Editor Instance
  const editor = useCreateBlockNote();
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
        const descText = item.description || "";
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
      const { data } = await api.put(`/content/${encodeURIComponent(contentId)}`, {
        title: title.trim(),
        description: description.trim(),
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
      const cleanDocMarkdown = (docMarkdown || "")
        .replace(/\\+(\s*\r?\n)/g, "$1")
        .replace(/\\+\s*$/gm, "");

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
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF", {
        id: "export-pdf",
        description: error.response?.data?.message || error.message || "Server error",
      });
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
                setDescription(markdown);
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
