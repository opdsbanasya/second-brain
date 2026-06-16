import type { Tag } from "@/lib/data";

const colorClass: Record<Tag["color"], string> = {
  blue: "tag-blue",
  green: "tag-green",
  pink: "tag-pink",
  amber: "tag-amber",
  violet: "tag-violet",
  rose: "tag-rose",
  teal: "tag-teal",
  slate: "tag-slate",
};

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span
      className={`${colorClass[tag.color]} inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}
    >
      {tag.name}
    </span>
  );
}
