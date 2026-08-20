import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { useAppSelector } from "@/store/hooks";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ContentItem, type Tag } from "@/lib/data";

export interface ContentDraft {
  id: string;
  title: string;
  link: string;
  description: string;
  type: ContentItem["type"] | string;
  tags: string;
}

interface ContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ContentDraft;
  setDraft: Dispatch<SetStateAction<ContentDraft>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}

export function ContentModal({
  open,
  onOpenChange,
  draft,
  setDraft,
  onSubmit,
  saving,
}: ContentModalProps) {
  const isEditing = Boolean(draft.id);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [matchingTags, setMatchingTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!tagInput.trim()) {
      setMatchingTags([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/tags?q=${tagInput}`);
        const fetchedTags = res.data.tags.map((tag: any) => ({
          id: tag._id || tag.name,
          name: tag.name,
          color: tag.color || "slate",
        }));
        setMatchingTags(fetchedTags.filter((t: any) => !tags.includes(t.name)).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [tagInput, tags]);

  useEffect(() => { 
    if (!open) return;

    const initialTags = draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setTags(initialTags);
    setTagInput("");
  }, [draft.id, draft.tags, open]);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      tags: tags.join(", "),
    }));
  }, [setDraft, tags]);

  const commitTag = (value: string) => {
    const normalized = value.trim();

    if (!normalized) {
      return;
    }

    setTags((current) =>
      current.includes(normalized) ? current : [...current, normalized],
    );
  };

  const removeTag = (value: string) => {
    setTags((current) => current.filter((tag) => tag !== value));
    setTagInput(value);
  };

  const handleTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (!value.includes(",")) {
      setTagInput(value);
      return;
    }

    const parts = value.split(",");
    const trailingValue = parts.pop() ?? "";

    parts.forEach((part) => commitTag(part));
    setTagInput(trailingValue);
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      commitTag(tagInput);
      setTagInput("");
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      event.preventDefault();
      setTags((current) => current.slice(0, -1));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass flex max-h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] max-w-xl flex-col overflow-hidden bg-card/95 p-0 text-card-foreground shadow-[0_30px_120px_rgba(0,0,0,0.18)] sm:rounded-3xl">
        <div className="relative flex max-h-full flex-col p-4 sm:p-5 overflow-y-auto">
            <form
              className="flex flex-col rounded-2xl border border-border bg-background/70 p-4 sm:p-5"
              onSubmit={onSubmit}
            >
              <DialogHeader className="mb-4 items-start space-y-2 text-left">
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {isEditing ? "Edit content" : "Create content"}
                </DialogTitle>
                <DialogDescription className="max-w-lg text-sm text-muted-foreground">
                  Add a note, link, or resource, then organize it with tags.
                </DialogDescription>
              </DialogHeader>

              <div className="flex min-h-0 flex-1 flex-col space-y-4">
                <div className="space-y-2.5 rounded-2xl border border-border bg-card p-3 sm:p-4">
                  <Label
                    htmlFor="content-title"
                    className="text-sm font-medium text-foreground"
                  >
                    Title
                  </Label>
                  <Input
                    id="content-title"
                    required
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="h-12 bg-background text-base text-foreground placeholder:text-muted-foreground"
                    placeholder="Give this item a clear title"
                  />
                </div>

                <div className="space-y-2.5 rounded-2xl border border-border bg-card p-3 sm:p-4">
                  <Label
                    htmlFor="content-link"
                    className="text-sm font-medium text-foreground"
                  >
                    URL
                  </Label>
                  <Input
                    id="content-link"
                    type="url"
                    placeholder="https://..."
                    value={draft.link}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        link: event.target.value,
                      }))
                    }
                    className="h-12 bg-background text-base text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2.5 rounded-2xl border border-border bg-card p-3 sm:p-4">
                  <Label
                    htmlFor="content-type"
                    className="text-sm font-medium text-foreground"
                  >
                    Type
                  </Label>
                  <select
                    id="content-type"
                    value={draft.type}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        type: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none transition focus:border-ring"
                  >
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

                <div className="space-y-2.5 rounded-2xl border border-border bg-card p-3 sm:p-4">
                  <Label
                    htmlFor="content-tags"
                    className="text-sm font-medium text-foreground"
                  >
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="w-full space-y-1 relative">
                    <Input
                      id="content-tags"
                      placeholder="work, ideas"
                      value={tagInput}
                      onChange={handleTagChange}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => {
                        commitTag(tagInput);
                        setTagInput("");
                      }}
                      className="h-12 bg-background text-base text-foreground placeholder:text-muted-foreground"
                    />
                    {tagInput && matchingTags.length > 0 && (
                      <div className="absolute top-full mt-1 w-full rounded-md border border-border bg-card p-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                        {matchingTags.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-sm transition-colors cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              commitTag(t.name);
                              setTagInput("");
                            }}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="pt-2 sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={saving} className="min-w-32">
                    {saving ? "Saving..." : isEditing ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
