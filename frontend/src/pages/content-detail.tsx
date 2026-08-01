import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, Link as LinkIcon, LoaderCircle, Video } from "lucide-react";
import { Link, useParams } from "react-router";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

type Content = {
  title: string;
  description?: string;
  link?: string;
  contentType: string;
  tags?: string[];
  createdAt: string
};
const typeIcon = { video: Video, link: LinkIcon, article: FileText } as const;

export default function ContentDetailPage() {
  const { contentId } = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contentId) return;
    api.get(`/content/${encodeURIComponent(contentId)}`)
      .then(({ data }) => setContent(data.content))
      .catch((requestError) => setError(requestError.response?.status === 404 ? "Invalid content. You do not have access to this item." : "We could not load this content."));
  }, [contentId]);

  if (error) return <main className="grid min-h-screen place-items-center bg-background p-6">
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-semibold">Content unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      <Link to="/dashboard" className="mt-6 inline-block text-sm font-medium text-primary">Back to dashboard</Link>
    </div>
  </main>;

  if (!content) return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
    <LoaderCircle className="h-5 w-5 animate-spin" />
  </div>;

  const Icon = typeIcon[content.contentType as keyof typeof typeIcon] ?? FileText;
  return <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
    <article className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
      <Link to="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />Dashboard
      </Link>
      <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4" />{content.contentType}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{content.title}</h1>
      {content.description && <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-muted-foreground">{content.description}</p>}
      {content.tags && content.tags.length > 0 && <div className="mt-6 flex flex-wrap gap-2">
        {content.tags.map((tag) => <span key={tag} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{tag}</span>)}
      </div>}
      {content.link && <a href={content.link} target="_blank" rel="noreferrer" className="mt-8 inline-block">
        <Button><ExternalLink className="mr-2 h-4 w-4" />Open resource</Button>
      </a>}
      <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
        Saved {new Date(content.createdAt).toLocaleDateString()}
      </p>
    </article>
  </main>;
}
