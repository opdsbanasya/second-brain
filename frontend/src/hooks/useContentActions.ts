import { useState, type FormEvent } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createShareLink } from "@/store/slices/shareSlice";
import { createContent, updateContent, deleteContent } from "@/store/slices/contentSlice";
import { fetchTags } from "@/store/slices/tagSlice";
import { toast } from "sonner";
import { type ContentItem } from "@/lib/data";
import { type ContentDraft } from "@/components/ContentModal";

export function useContentActions(onSuccess?: () => void) {
  const dispatch = useAppDispatch();
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<ContentDraft>({ id: "", title: "", link: "", description: "", type: "note", tags: "" });

  const handleShare = async (item: { id: string }) => {
    try {
      const shareLink = await dispatch(createShareLink(item.id)).unwrap();
      const url = `${window.location.origin}${shareLink.url}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Ignore clipboard errors
      }
      toast.success("Link copied!", { description: url });
    } catch (err: any) {
      toast.error("Failed to share", { description: err });
    }
  };

  const handleEdit = (item: { id: string; title: string; link?: string | null; description?: string; type?: string; contentType?: string; tagIds?: string[]; tags?: string[] }) => {
    setDraft({
      id: item.id,
      title: item.title,
      link: item.link || "",
      description: item.description || "",
      type: item.type || item.contentType || "note",
      tags: item.tagIds ? item.tagIds.join(", ") : (item.tags ? item.tags.join(", ") : ""),
    });
    setCreateOpen(true);
  };

  const handleDelete = async (item: { id: string }) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return false;
    try {
      await dispatch(deleteContent(item.id)).unwrap();
      toast.success("Content deleted");
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      toast.error("Failed to delete", { description: err });
      return false;
    }
  };

  const handleCreate = () => {
    setDraft({ id: "", title: "", link: "", description: "", type: "note", tags: "" });
    setCreateOpen(true);
  };

  const saveContent = async (event: FormEvent<HTMLFormElement>) => {
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
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Could not save content", { description: String(error) });
    } finally {
      setSaving(false);
    }
  };

  return {
    createOpen,
    setCreateOpen,
    saving,
    draft,
    setDraft,
    handleShare,
    handleEdit,
    handleDelete,
    handleCreate,
    saveContent
  };
}
