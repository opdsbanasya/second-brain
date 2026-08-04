import {
  Share2,
  ExternalLink,
  MoreHorizontal,
  FileText,
  Link as LinkIcon,
  Video,
  StickyNote,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/TagBadge";
import { MarkdownContent } from "@/components/MarkdownContent";
import { type ContentItem, type Tag } from "@/lib/data";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeIcon = new Map<ContentItem["type"], typeof FileText>([
  ["article", FileText],
  ["link", LinkIcon],
  ["video", Video],
  ["note", StickyNote],
  ["podcast", StickyNote],
  ["book", StickyNote],
  ["course", StickyNote],
  ["other", StickyNote],
]);

interface ContentCardProps {
  item: ContentItem;
  onShare: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
}

export function ContentCard({
  item,
  onShare,
  onEdit,
  onDelete,
}: ContentCardProps) {
  const Icon = typeIcon.get(item.type) ?? StickyNote;
  const itemTags: Tag[] = item.tagIds.map((name, index) => ({
    id: name,
    name,
    color: (
      [
        "blue",
        "green",
        "violet",
        "amber",
        "teal",
        "rose",
        "pink",
        "slate",
      ] as Tag["color"][]
    )[index % 8]!,
  }));

  return (
    // Minimalism — solid card surface, no glass, very subtle border, no heavy shadow
    <article className="group flex break-inside-avoid flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {item.type}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 transition group-hover:opacity-100 data-[state=open]:opacity-100"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        to={`/content/${item.id}`}
        className="text-base font-semibold leading-snug text-foreground hover:text-primary capitalize"
      >
        {item.title}
      </Link>

      <MarkdownContent
        content={item.description}
        compact
        className="mt-2 text-muted-foreground"
      />

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
