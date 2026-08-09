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
  Tag as TagIcon
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Navigation & Action Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Action & Save Status Controls */}
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                Saving...
              </span>
            ) : hasChanges ? (
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </Button>
            ) : isSaved ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                <Check className="h-3.5 w-3.5" />
                Saved
              </span>
            ) : null}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare({ id: contentId! })}
              className="h-8 gap-1.5 text-xs hover:text-primary"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>

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
        </div>

        {/* Notion-Style Document Editor Container */}
        <article className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-10 transition-all">
          {/* Read-Only Type & Saved Date Badges */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground capitalize">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {initialContent.contentType}
              </span>
            </div>

            <span className="text-muted-foreground">
              Saved {new Date(initialContent.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Inline Editable Title */}
          <div className="group relative mb-6">
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
              className="w-full resize-none border-b border-transparent bg-transparent text-3xl font-bold tracking-tight text-foreground transition-all hover:bg-accent/20 focus:border-primary/40 focus:bg-background focus:outline-none sm:text-4xl p-2 -ml-2 rounded-lg"
            />
          </div>

          {/* Properties Section (Link & Read-Only Tags) */}
          <div className="mb-8 space-y-3 rounded-xl border border-border/50 bg-muted/20 p-4 text-sm">
            {/* Link Property (Editable URL) */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
              <span className="flex w-24 shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <LinkIcon className="h-3.5 w-3.5" /> Link
              </span>
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Add a link (e.g. https://example.com)..."
                  className="flex-1 rounded-md border border-transparent bg-transparent px-2.5 py-1 text-sm text-foreground transition-all hover:bg-background/80 focus:border-border focus:bg-background focus:outline-none"
                />
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground hover:bg-accent/80 transition-colors shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" /> Open
                  </a>
                )}
              </div>
            </div>

            {/* Tags Property (Read-Only Badges) */}
            {initialContent.tags && initialContent.tags.length > 0 && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex w-24 shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <TagIcon className="h-3.5 w-3.5" /> Tags
                </span>
                <div className="flex flex-wrap gap-1.5 py-1">
                  {initialContent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent/80 px-2.5 py-0.5 text-xs font-medium text-accent-foreground select-none"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BlockNote Rich-Text Editor View (Default & Always Editable) */}
          <div className="min-h-[20rem] rounded-xl border border-input bg-background p-2 sm:p-4">
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
              className="bn-editor-scroll h-full min-h-[16rem] w-full"
            />
          </div>
        </article>
      </div>

      <Toaster position="bottom-right" />
    </main>
  );
}
