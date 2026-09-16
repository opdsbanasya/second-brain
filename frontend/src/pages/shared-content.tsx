import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  FileText,
  Link as LinkIcon,
  LoaderCircle,
  Video,
} from "lucide-react";
import { Link, useParams } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/MarkdownContent";

type SharedContent = {
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

export default function SharedContentPage() {
  const { sharedId } = useParams();
  const [content, setContent] = useState<SharedContent | null>(null);
  const [error, setError] = useState("");
  const fetchedSharedId = useRef<string | null>(null);

  useEffect(() => {
    // Strict Mode runs effects twice in development. Fetching only once per ID
    // prevents one visit from incrementing the server-side view counter twice.
    if (!sharedId || fetchedSharedId.current === sharedId) return;
    fetchedSharedId.current = sharedId;
    setContent(null);
    setError("");

    api
      .get(`/shared-links/public/${encodeURIComponent(sharedId)}`)
      .then(({ data }) => setContent(data.content))
      .catch((requestError) =>
        setError(
          requestError.response?.status === 404
            ? "This shared link is unavailable or has been revoked."
            : "We could not load this shared content.",
        ),
      );
  }, [sharedId]);

  if (error)
    return <Status title="Shared content unavailable" message={error} />;
  if (!content)
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
    );

  const Icon = getContentIcon(content.contentType);
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <Link
          to="/"
          className="mb-8 inline-flex text-sm font-semibold text-primary"
        >
          Second Brain
        </Link>

        <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Icon className="h-4 w-4" />
          {content.contentType}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {content?.title}
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
          Shared {new Date(content.createdAt).toLocaleDateString()}
        </p>
      </article>
    </main>
  );
}

function Status({ title, message }: { title: string; message: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-primary"
        >
          Go to Second Brain
        </Link>
      </div>
    </main>
  );
}
