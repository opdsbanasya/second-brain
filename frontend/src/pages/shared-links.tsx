
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Copy, Trash2, ExternalLink, Link2, Pencil, UserMinus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  sharedLinks as seedLinks,
  contentItems,
  users as seedUsers,
  type SharedLink,
  type User,
} from "@/lib/data";

export default function SharedLinksPagePage() {
  return <SharedLinksPage />;
}

type Confirm =
  | { kind: "revoke"; id: string }
  | { kind: "remove-user"; id: string }
  | null;

function SharedLinksPage() {
  const [query, setQuery] = useState("");
  const [links, setLinks] = useState<SharedLink[]>(seedLinks);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [editing, setEditing] = useState<SharedLink | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [confirm, setConfirm] = useState<Confirm>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links
      .map((l) => ({ link: l, content: contentItems.find((c) => c.id === l.contentId) }))
      .filter(({ link, content }) =>
        !q
          ? true
          : link.url.toLowerCase().includes(q) ||
            content?.title.toLowerCase().includes(q),
      );
  }, [links, query]);

  const copy = async (url: string) => {
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    toast.success("Link copied!", { description: url });
  };

  const openEdit = (l: SharedLink) => { setEditing(l); setEditUrl(l.url); };
  const saveEdit = () => {
    if (!editing) return;
    setLinks((ls) => ls.map((l) => (l.id === editing.id ? { ...l, url: editUrl } : l)));
    toast.success("Link updated");
    setEditing(null);
  };

  const confirmRevoke = () => {
    if (confirm?.kind !== "revoke") return;
    setLinks((ls) => ls.filter((l) => l.id !== confirm.id));
    toast.success("Share revoked");
    setConfirm(null);
  };
  const confirmRemoveUser = () => {
    if (confirm?.kind !== "remove-user") return;
    setUsers((us) => us.filter((u) => u.id !== confirm.id));
    toast.success("User removed");
    setConfirm(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar query={query} onQueryChange={setQuery} onCreate={() => toast("Create modal")} />

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Shared links</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {links.length} active {links.length === 1 ? "link" : "links"} · revoke or edit any time
            </p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search links..."
              className="h-9 pl-9"
            />
          </div>
        </div>

        {/* Minimalist solid card surface */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No shared links yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map(({ link, content }) => (
                <li key={link.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <p className="truncate text-sm font-medium text-foreground">
                        {content?.title ?? "Untitled content"}
                      </p>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-xs text-muted-foreground hover:text-primary"
                    >
                      {link.url}
                    </a>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Shared {link.createdAt.slice(0, 10)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => copy(link.url)}>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> Open
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openEdit(link)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-destructive hover:text-destructive"
                      onClick={() => setConfirm({ kind: "revoke", id: link.id })}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Revoke
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* People with access */}
        <div className="mt-10">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">People with access</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Remove anyone who shouldn't see your shared links.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {users.map((u) => (
                <li key={u.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    {u.role === "admin" && (
                      <span className="tag-violet ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => setConfirm({ kind: "remove-user", id: u.id })}
                  >
                    <UserMinus className="h-3.5 w-3.5" /> Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Edit dialog — glassmorphism on overlay surface */}
      <AlertDialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit shared link</AlertDialogTitle>
            <AlertDialogDescription>
              Update the URL slug or destination for this shared link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveEdit}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "revoke" ? "Revoke this link?" : "Remove this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "revoke"
                ? "Anyone using this link will lose access immediately. This can't be undone."
                : "They'll lose access to anything you've shared. You can re-invite them later."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirm?.kind === "revoke" ? confirmRevoke : confirmRemoveUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {confirm?.kind === "revoke" ? "Revoke" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="bottom-right" />
    </div>
  );
}
