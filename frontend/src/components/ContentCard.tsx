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
  Play,
  Globe,
  BookOpen,
  Music,
  Film
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

interface ContentCardProps {
  item: ContentItem;
  onShare: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
}

function getDomain(url?: string) {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    return domain;
  } catch {
    return null;
  }
}

export function ContentCard({
  item,
  onShare,
  onEdit,
  onDelete,
}: ContentCardProps) {
  const domain = getDomain(item.link);
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

  // Render Visually Distinct Card Styles Based on ContentType
  return (
    <article className="group flex break-inside-avoid flex-col rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5 transition-all hover:border-[#4F46E5]/40 hover:shadow-xs">
      {/* Header Row: Type Badge & Action Menu */}
      <div className="mb-3 flex items-center justify-between">
        {item.type === "article" && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#4F46E5]/10 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase text-[#4F46E5]">
            <BookOpen className="h-3 w-3" /> ARTICLE
          </span>
        )}

        {item.type === "video" && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase text-rose-600">
            <Video className="h-3 w-3" /> VIDEO
          </span>
        )}

        {item.type === "link" && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase text-emerald-700">
            <Globe className="h-3 w-3" /> LINK {domain ? `· ${domain}` : ""}
          </span>
        )}

        {item.type !== "article" && item.type !== "video" && item.type !== "link" && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase text-[#0F172A]">
            <FileText className="h-3 w-3 text-[#4F46E5]" /> {item.type}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4 text-[#64748B]" />
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

      {/* Video Specific Visual Banner */}
      {item.type === "video" && (
        <div className="mb-3 relative flex h-28 w-full items-center justify-center rounded-lg bg-slate-900 text-white overflow-hidden group/video">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs transition-transform group-hover/video:scale-110">
            <Play className="h-5 w-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Link Specific URL Banner */}
      {item.type === "link" && item.link && (
        <div className="mb-3 rounded-lg border border-[#E2E8F0] bg-slate-50 p-2.5 text-xs text-[#64748B] flex items-center justify-between gap-2 font-mono">
          <span className="truncate">{item.link}</span>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="text-[#4F46E5] hover:underline flex items-center gap-1 shrink-0 font-semibold"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Title */}
      <Link
        to={`/content/${item.id}`}
        className="font-heading font-bold text-base text-[#0F172A] hover:text-[#4F46E5] transition-colors leading-snug"
      >
        {item.title}
      </Link>

      {/* Snippet Description */}
      {item.description && (
        <MarkdownContent
          content={item.description}
          compact
          className="mt-2 text-xs text-[#64748B] leading-relaxed line-clamp-3"
        />
      )}

      {/* Tags */}
      {itemTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {itemTags.map((t) => t && <TagBadge key={t.id} tag={t} />)}
        </div>
      )}

      {/* Card Footer: Date & Share */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-[#64748B]">
        <span>{item.createdAt ? item.createdAt.slice(0, 10) : "Recent"}</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(item)}
          className="h-7 gap-1.5 text-xs text-[#64748B] hover:text-[#4F46E5]"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </article>
  );
}
