
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { TagSidebar } from "@/components/TagSidebar";
import { ContentCard } from "@/components/ContentCard";
import { type ContentItem } from "@/lib/data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContents } from "@/store/slices/contentSlice";
import { fetchTags } from "@/store/slices/tagSlice";
import { createShareLink } from "@/store/slices/shareSlice";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardPagePage() {
  return <DashboardPage />;
}

function DashboardPage() {
  const [query, setQuery] = useState("");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const { items: contentItems, loading: contentsLoading } = useAppSelector(state => state.content);
  const { tags, loading: tagsLoading } = useAppSelector(state => state.tags);

  useEffect(() => {
    dispatch(fetchContents());
    dispatch(fetchTags(""));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contentItems.filter((item) => {
      const matchesTag = !activeTagId || item.tagIds.includes(activeTagId);
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [query, activeTagId]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of tags) c[t.id] = 0;
    for (const item of contentItems) {
      for (const id of item.tagIds) c[id] = (c[id] ?? 0) + 1;
    }
    return c;
  }, [tags, contentItems]);

  const handleShare = async (item: ContentItem) => {
    try {
      const hash = await dispatch(createShareLink(item.id)).unwrap();
      const url = `${window.location.origin}/s/${hash}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* ignore clipboard errors in restricted contexts */
      }
      toast.success("Link copied!", { description: url });
    } catch (err: any) {
      toast.error("Failed to share", { description: err });
    }
  };

  const handleCreate = () => {
    toast("Create modal", { description: "Hook up the Create/Edit Content dialog here." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar query={query} onQueryChange={setQuery} onCreate={handleCreate} />

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <TagSidebar
          activeTagId={activeTagId}
          onSelect={setActiveTagId}
          counts={counts}
          total={contentItems.length}
        />

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {activeTagId ? tags.find((t) => t.id === activeTagId)?.name : "All content"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "item" : "items"} saved
              </p>
            </div>

            <div className="relative w-full max-w-xs md:hidden">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 pl-9"
              />
            </div>
          </div>

          {contentsLoading ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">Loading content...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nothing here yet. Try clearing your search or filters.
              </p>
            </div>
          ) : (
            // Masonry via CSS columns — clean, no library needed
            <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5">
              {filtered.map((item) => (
                <ContentCard key={item.id} item={item} onShare={handleShare} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating toasts — glassmorphism applied via sonner's default styling */}
      <Toaster position="bottom-right" />
    </div>
  );
}
