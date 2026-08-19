import { useMemo, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TagSidebar } from "@/components/TagSidebar";
import { ContentCard } from "@/components/ContentCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContents } from "@/store/slices/contentSlice";
import { fetchTags } from "@/store/slices/tagSlice";
import {
  Plus,
  FileText,
  Link as LinkIcon,
  Video,
  BookOpen,
  Inbox,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentModal } from "@/components/ContentModal";
import { useContentActions } from "@/hooks/useContentActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPagePage() {
  return <DashboardPage />;
}

export function DashboardPage() {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "recent">("all");

  const dispatch = useAppDispatch();
  const { items: contentItems, loading: contentsLoading, searchQuery: query } = useAppSelector(
    (state) => state.content
  );
  const { tags } = useAppSelector((state) => state.tags);

  const {
    createOpen,
    setCreateOpen,
    saving,
    draft,
    setDraft,
    handleShare,
    handleEdit,
    handleDelete,
    saveContent,
  } = useContentActions();

  useEffect(() => {
    dispatch(fetchContents());
    dispatch(fetchTags(""));
  }, [dispatch]);

  // Filtered contents based on active tag or filter tab
  const filtered = useMemo(() => {
    let result = [...contentItems];

    // Apply Recent Filter: Sort by newest first and limit to top 5
    if (activeFilter === "recent") {
      result = result
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    }

    return result.filter((item) => {
      const matchesTag = !activeTagId || item.tagIds.includes(activeTagId);
      return matchesTag;
    });
  }, [activeTagId, activeFilter, contentItems]);

  // Count tag occurrences
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of tags) c[t.id] = 0;
    for (const item of contentItems) {
      for (const id of item.tagIds) c[id] = (c[id] ?? 0) + 1;
    }
    return c;
  }, [tags, contentItems]);

  // Open Create Modal with Pre-Selected Type
  const openCreateWithType = (type: string) => {
    setDraft({
      id: "",
      title: "",
      link: "",
      description: "",
      type: type,
      tags: activeTagId ? tags.find((t) => t.id === activeTagId)?.name || "" : "",
    });
    setCreateOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5]/10 selection:text-[#4F46E5]">
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1600px] gap-6 lg:gap-8 px-4 py-6 sm:px-8 sm:py-10">
        {/* Left Sidebar Navigation */}
        <TagSidebar
          tags={tags}
          activeTagId={activeTagId}
          activeFilter={activeFilter}
          onSelect={(tagId) => {
            setActiveTagId(tagId);
            if (tagId !== null) setActiveFilter(null as any);
          }}
          onSelectFilter={(filter) => {
            setActiveFilter(filter);
            setActiveTagId(null);
          }}
          counts={counts}
          total={contentItems.length}
        />

        {/* Main Dashboard Area */}
        <main className="min-w-0 flex-1 space-y-6">
          {/* TOP HEADER ROW: Title & New Content Dropdown Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-5">
            {/* Title & Resource Count */}
            <div>
              <h1 className="font-heading font-extrabold text-3xl tracking-tight text-[#0F172A]">
                {activeTagId
                  ? `Tag: #${tags.find((t) => t.id === activeTagId)?.name}`
                  : activeFilter === "recent"
                  ? "Recent 5 Additions"
                  : "Knowledge Base"}
              </h1>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                {filtered.length} {filtered.length === 1 ? "resource" : "resources"} indexed
              </p>
            </div>

            {/* New Content Dropdown Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-10 gap-2 bg-[#4F46E5] text-white hover:bg-[#4338CA] font-semibold text-xs px-4 rounded-xl shadow-xs shrink-0">
                  <Plus className="h-4 w-4" />
                  New Content
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => openCreateWithType("note")} className="gap-2.5 cursor-pointer">
                  <FileText className="h-4 w-4 text-[#4F46E5]" /> Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCreateWithType("link")} className="gap-2.5 cursor-pointer">
                  <LinkIcon className="h-4 w-4 text-emerald-600" /> Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCreateWithType("article")} className="gap-2.5 cursor-pointer">
                  <BookOpen className="h-4 w-4 text-blue-600" /> Article
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCreateWithType("video")} className="gap-2.5 cursor-pointer">
                  <Video className="h-4 w-4 text-rose-600" /> Video
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCreateWithType("document")} className="gap-2.5 cursor-pointer">
                  <FileText className="h-4 w-4 text-slate-700" /> Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CONTENT MASONRY GRID & EMPTY STATES */}
          {contentsLoading ? (
            <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-16 text-center space-y-3">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#4F46E5] border-t-transparent" />
              <p className="text-sm text-[#64748B] font-medium">Loading your second brain...</p>
            </div>
          ) : filtered.length === 0 ? (
            /* RICH EMPTY STATE */
            <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-16 text-center space-y-4 max-w-md mx-auto my-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-[#64748B]">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                  No resources found
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {query
                    ? `No notes match "${query}". Try clearing your search term.`
                    : activeTagId
                    ? `No notes tagged with #${tags.find((t) => t.id === activeTagId)?.name} yet.`
                    : "Save your first note, link, or article to build your memory database."}
                </p>
              </div>
              <Button
                onClick={() => openCreateWithType("note")}
                className="bg-[#4F46E5] text-white hover:bg-[#4338CA] text-xs font-semibold px-4 py-2"
              >
                Save your first note
              </Button>
            </div>
          ) : (
            /* MASONRY CARD GRID */
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-3 *:mb-6">
              {filtered.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onShare={handleShare}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <Toaster position="bottom-right" />
      <ContentModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        draft={draft}
        setDraft={setDraft}
        onSubmit={saveContent}
        saving={saving}
      />
    </div>
  );
}
