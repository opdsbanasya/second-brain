import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  LoaderCircle,
  Video,
  Share2,
  Pencil,
  Trash
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ContentModal } from "@/components/ContentModal";
import { useContentActions } from "@/hooks/useContentActions";
import { Toaster } from "@/components/ui/sonner";

type Content = {
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
    default:
      return FileText;
  }
}

export default function ContentDetailPage() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState("");

  const fetchContent = () => {
    if (!contentId) return;
    api
      .get(`/content/${encodeURIComponent(contentId)}`)
      .then(({ data }) => setContent(data.content))
      .catch((requestError) =>
        setError(
          requestError.response?.status === 404
            ? "Invalid content. You do not have access to this item."
            : "We could not load this content.",
        ),
      );
  };

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const {
    createOpen,
    setCreateOpen,
    saving,
    draft,
    setDraft,
    handleShare,
    handleEdit,
    handleDelete,
    saveContent
  } = useContentActions(() => {
    fetchContent();
  });

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

  if (!content)
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
    );

  const Icon = getContentIcon(content.contentType);
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <article className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="mb-5 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {content.contentType}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleShare({ id: contentId! })} className="h-8 gap-1.5 text-xs hover:text-primary">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEdit({ id: contentId!, ...content })} className="h-8 gap-1.5 text-xs hover:text-primary">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => {
              const deleted = await handleDelete({ id: contentId! });
              if (deleted) navigate("/dashboard");
            }} className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {content.title}
        </h1>
        {content.description && (
          <div className="mt-5 text-muted-foreground">
            <MarkdownContent content={content.description} />
          </div>
        )}
        {content.tags && content.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block"
          >
            <Button>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open resource
            </Button>
          </a>
        )}
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Saved {new Date(content.createdAt).toLocaleDateString()}
        </p>
      </article>
      <Toaster position="bottom-right" />
      <ContentModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        draft={draft}
        setDraft={setDraft}
        onSubmit={saveContent}
        saving={saving}
      />
    </main>
  );
}
