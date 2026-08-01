
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TagSidebar } from "@/components/TagSidebar";
import { ContentCard } from "@/components/ContentCard";
import { type ContentItem } from "@/lib/data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContents } from "@/store/slices/contentSlice";
import { fetchTags } from "@/store/slices/tagSlice";
import { createShareLink } from "@/store/slices/shareSlice";
import { createContent, updateContent, deleteContent } from "@/store/slices/contentSlice";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DashboardPagePage() {
  return <DashboardPage />;
}

function DashboardPage() {
  const [query, setQuery] = useState("");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ id: "", title: "", link: "", description: "", type: "note", tags: "" });

  const dispatch = useAppDispatch();
  const { items: contentItems, loading: contentsLoading } = useAppSelector(state => state.content);
  const { tags } = useAppSelector(state => state.tags);

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
  }, [query, activeTagId, contentItems]);

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
      const shareLink = await dispatch(createShareLink(item.id)).unwrap();
      const url = `${window.location.origin}${shareLink.url}`;
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

  const handleEdit = (item: ContentItem) => {
    setDraft({
      id: item.id,
      title: item.title,
      link: item.link || "",
      description: item.description,
      type: item.type,
      tags: item.tagIds.join(", "),
    });
    setCreateOpen(true);
  };

  const handleDelete = async (item: ContentItem) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await dispatch(deleteContent(item.id)).unwrap();
      toast.success("Content deleted");
    } catch (err: any) {
      toast.error("Failed to delete", { description: err });
    }
  };

  const handleCreate = () => {
    setDraft({ id: "", title: "", link: "", description: "", type: "note", tags: "" });
    setCreateOpen(true);
  };

  const saveContent = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: draft.title.trim(),
        link: draft.link.trim() || undefined,
        description: draft.description.trim(),
        type: draft.type as ContentItem["type"],
        tagIds: draft.tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean),
      };

      if (draft.id) {
        await dispatch(updateContent({ id: draft.id, data: payload })).unwrap();
      } else {
        await dispatch(createContent(payload)).unwrap();
      }

      await dispatch(fetchTags("")).unwrap();
      setCreateOpen(false);
      toast.success(draft.id ? "Content updated" : "Content saved");
    } catch (error) {
      toast.error("Could not save content", { description: String(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="mx-auto flex w-full  gap-6 px-6 py-6">
        <TagSidebar
          tags={tags}
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
            <Button onClick={handleCreate} className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>

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
                <ContentCard key={item.id} item={item} onShare={handleShare} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating toasts — glassmorphism applied via sonner's default styling */}
      <Toaster position="bottom-right" />
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit content" : "Save to your brain"}</DialogTitle>
            <DialogDescription>Add a note, link, or resource and organize it with tags.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveContent}>
            <div className="space-y-2">
              <Label htmlFor="content-title">Title *</Label>
              <Input id="content-title" required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-link">URL</Label>
              <Input id="content-link" type="url" placeholder="https://..." value={draft.link} onChange={(event) => setDraft({ ...draft, link: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-description">Description</Label>
              <textarea id="content-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="content-type">Type *</Label>
                <select id="content-type" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="note">Note</option>
                  <option value="link">Link</option>
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="podcast">Podcast</option>
                  <option value="book">Book</option>
                  <option value="course">Course</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-tags">Tags *</Label>
                <Input id="content-tags" placeholder="work, ideas" value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} />
              </div>
            </div>
            <DialogFooter><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save content"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
