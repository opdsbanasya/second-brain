import type { Tag } from "@/lib/data";
import { Hash, Globe, Zap } from "lucide-react";

interface TagSidebarProps {
  tags: Tag[];
  activeTagId: string | null;
  activeFilter?: "all" | "recent" | null;
  onSelect: (tagId: string | null) => void;
  onSelectFilter?: (filter: "all" | "recent") => void;
  counts: Record<string, number>;
  total: number;
}

export function TagSidebar({
  tags,
  activeTagId,
  activeFilter = "all",
  onSelect,
  onSelectFilter,
  counts,
  total,
}: TagSidebarProps) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-60 shrink-0 select-none flex-col justify-between py-2 lg:flex">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Navigate
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                onSelect(null);
                if (onSelectFilter) onSelectFilter("all");
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTagId === null && activeFilter === "all"
                  ? "bg-[#4F46E5] text-white font-semibold shadow-xs"
                  : "text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 opacity-80" />
                All Resources
              </span>
              <span className="text-xs opacity-75 font-mono">{total}</span>
            </button>

            <button
              onClick={() => {
                onSelect(null);
                if (onSelectFilter) onSelectFilter("recent");
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTagId === null && activeFilter === "recent"
                  ? "bg-[#4F46E5] text-white font-semibold shadow-xs"
                  : "text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 opacity-80 text-amber-500" />
                Recent Items
              </span>
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Tags</span>
            <span className="font-mono text-[10px] text-[#94A3B8]">{tags.length}</span>
          </div>

          <div className="space-y-0.5 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
            {tags.map((t) => {
              const active = activeTagId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelect(t.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-[#4F46E5] text-white font-semibold shadow-xs"
                      : "text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Hash className={`h-3.5 w-3.5 ${active ? "text-white" : "text-[#94A3B8]"}`} />
                    <span className="truncate">{t.name}</span>
                  </span>
                  <span className={`text-xs font-mono ${active ? "text-white" : "text-[#94A3B8]"}`}>
                    {counts[t.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
