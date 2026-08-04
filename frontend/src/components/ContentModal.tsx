import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
} from "react";

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
import { type ContentItem } from "@/lib/data";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

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
  const editor = useCreateBlockNote();

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

  useEffect(() => {
    if (!open) return;

    const blocks = draft.description.trim()
      ? editor.tryParseMarkdownToBlocks(draft.description)
      : [{ type: "paragraph" as const }];

    editor.replaceBlocks(editor.document, blocks);
  }, [draft.id, editor, open]);

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
      <DialogContent className="glass flex h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] max-w-6xl flex-col overflow-hidden bg-card/95 p-0 text-card-foreground shadow-[0_30px_120px_rgba(0,0,0,0.18)] sm:h-[calc(100vh-3rem)] sm:w-[calc(100vw-2rem)] sm:rounded-3xl">
        <div className="relative flex h-full flex-1 flex-col p-4 sm:p-5">
          <div className="grid flex-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <form
              className="flex min-h-0 flex-col rounded-2xl border border-border bg-background/70 p-4 sm:p-5"
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
                  <div className="w-full space-y-1">
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

            <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-background/70 p-4 sm:p-5">
              <div className="flex min-h-0 flex-1 flex-col space-y-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      Description
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Enter description
                    </p>
                  </div>
                  <div className="hidden rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:block">
                    Markdown ready
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-input bg-background">
                  <BlockNoteView
                    editor={editor}
                    theme="light"
                    editable
                    shadCNComponents={{}}
                    onChange={(nextEditor) => {
                      setDraft((current) => ({
                        ...current,
                        description: nextEditor.blocksToMarkdownLossy(
                          nextEditor.document,
                        ),
                      }));
                    }}
                    className="bn-editor-scroll h-full min-h-112 flex-1 overflow-y-auto"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
