import { Share2, ExternalLink, MoreHorizontal, FileText, Link as LinkIcon, Video, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/TagBadge";
import { tagById, type ContentItem } from "@/lib/data";

const typeIcon = {
  article: FileText,
  link: LinkIcon,
  video: Video,
  note: StickyNote,
};

interface ContentCardProps {
  item: ContentItem;
  onShare: (item: ContentItem) => void;
}

export function ContentCard({ item, onShare }: ContentCardProps) {
  const Icon = typeIcon[item.type];
  const itemTags = item.tagIds.map(tagById).filter(Boolean);

  return (
    // Minimalism — solid card surface, no glass, very subtle border, no heavy shadow
    <article className="group flex break-inside-avoid flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {item.type}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 transition group-hover:opacity-100"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="text-base font-semibold leading-snug text-foreground">{item.title}</h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>

      {itemTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {itemTags.map((t) => t && <TagBadge key={t.id} tag={t} />)}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            Open
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">
            {item.createdAt.slice(0, 10)}
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(item)}
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-primary"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </article>
  );
}
