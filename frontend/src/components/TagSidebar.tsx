import type { Tag } from "@/lib/data";
import { Hash } from "lucide-react";

interface TagSidebarProps {
  tags: Tag[];
  activeTagId: string | null;
  onSelect: (tagId: string | null) => void;
  counts: Record<string, number>;
  total: number;
}

export function TagSidebar({
  tags,
  activeTagId,
  onSelect,
  counts,
  total,
}: TagSidebarProps) {
  return (
    // Glassmorphism — fixed sidebar is a floating element
    <aside className="glass sticky top-20 hidden h-[calc(100vh-6rem)] w-60 shrink-0 rounded-2xl p-4 lg:block">
      <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Filter by tag
      </div>

      <button
        onClick={() => onSelect(null)}
        className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
          activeTagId === null
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <span className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5" />
          All
        </span>
        <span className="text-xs opacity-80">{total}</span>
      </button>

      <div className="mt-2 space-y-0.5">
        {tags.map((t) => {
          const active = activeTagId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 opacity-70" />
                {t.name}
              </span>
              <span className="text-xs opacity-70">{counts[t.id] ?? 0}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
