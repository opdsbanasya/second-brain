import { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, Copy, Eye, Search, Settings2, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import api from "@/lib/api";

type SharedLink = { _id: string; contentId: string | { _id: string; title: string }; url: string; createdAt: string; expiresAt?: string; active: boolean; viewCount: number };
const dateInputValue = (value?: string) => value ? new Date(value).toISOString().slice(0, 10) : "";

export default function SharedLinksPage() {
  const [query, setQuery] = useState("");
  const [links, setLinks] = useState<SharedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SharedLink | null>(null);
  const [expiry, setExpiry] = useState("");

  const loadLinks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/shared-links");
      setLinks(data.sharedLinks ?? []);
    } catch (error: any) {
      toast.error("Could not load shared links", { description: error.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadLinks(); }, []);

  const visibleLinks = useMemo(() => { 
    const term = query.trim().toLowerCase(); 
    return term ? links.filter((link) => `${titleFor(link)} ${link.url}`.toLowerCase().includes(term)) : links; 
  }, [links, query]);

  const copy = async (link: SharedLink) => { 
    const url = `${window.location.origin}${link.url}`;
     try { await navigator.clipboard.writeText(url); 
    } catch { /* clipboard may be unavailable */ } 
    toast.success("Link copied", { description: url }); 
  };
  
  const update = async (link: SharedLink, changes: Record<string, unknown>) => {
    try { 
      const { data } = await api.patch(`/shared-links/${link._id}`, changes); 
      setLinks((current) => current.map((item) => item._id === link._id ? { ...item, ...data.shareLink } : item)); 
      return true; 
    }
    catch (error: any) { toast.error("Could not update link", { description: error.response?.data?.message }); return false; }
  };
  
  const toggle = async (link: SharedLink) => { 
    if (await update(link, { active: !link.active })) 
      toast.success(link.active ? "Link deactivated" : "Link activated"); };

  const remove = async (link: SharedLink) => { 
    if (!window.confirm("Delete this shared link permanently?")) return; 
    try { 
      await api.delete(`/shared-links/${link._id}`); 
      setLinks((current) => current.filter((item) => item._id !== link._id)); 
      toast.success("Shared link deleted"); 
    } catch (error: any) { 
      toast.error("Could not delete link", { description: error.response?.data?.message }); 
    } 
  };
  
  const openEdit = (link: SharedLink) => { 
    setEditing(link); setExpiry(dateInputValue(link.expiresAt)); 
  };
  
  const saveEdit = async () => { 
    if (!editing) return; 
    if (await update(editing, { expiresAt: expiry || null })) { 
      toast.success("Share settings updated"); setEditing(null); 
    } 
  };

  return <div className="min-h-screen bg-background">
    <main className="mx-auto max-w-5xl px-2 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shared links</h1>
          <p className="mt-1 text-sm text-muted-foreground">Control who can access your shared content.</p>
        </div>
        <div className="relative w-full max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search links..." className="pl-9" /></div>
      </div>
      {loading ? <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">Loading shared links...</p> : visibleLinks.length === 0 ? <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">No shared links yet.</p> : <div className="space-y-3">{visibleLinks.map((link) => <ShareCard key={link._id} link={link} onCopy={copy} onEdit={openEdit} onToggle={toggle} onDelete={remove} />)}</div>}
    </main>
    
    <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit shared link</DialogTitle>
          <DialogDescription>Set an optional expiry date. Clear it to keep the link available until you deactivate or delete it.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiration date</Label>
          <Input id="expiry" type="date" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
        </div>
        <DialogFooter>
          {expiry && <Button variant="outline" onClick={() => setExpiry("")}>Remove expiry</Button>}
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={saveEdit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Toaster position="bottom-right" /></div>;
}

function ShareCard({ link, onCopy, onEdit, onToggle, onDelete }: 
  {
    link: SharedLink;
    onCopy: (link: SharedLink) => void;
    onEdit: (link: SharedLink) => void;
    onToggle: (link: SharedLink) => void;
    onDelete: (link: SharedLink) => void
  }) {
  const expired = !!link.expiresAt && new Date(link.expiresAt) <= new Date();
  const active = link.active && !expired;
  const url = `${window.location.origin}${link.url}`;
  return <article className={`rounded-2xl border bg-card p-5 transition ${active ? "border-border" : "border-border/70 opacity-65"}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold">{titleFor(link)}</h2>
          <Status active={active} expired={expired} />
        </div>
        <button onClick={() => onCopy(link)} className="mt-2 block max-w-full truncate text-left text-xs text-primary hover:underline">{url}</button>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(link.createdAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{link.viewCount ?? 0} views</span>
          <span>{link.expiresAt ? `Expires ${new Date(link.expiresAt).toLocaleDateString()}` : "Never expires"}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton label="Copy link" onClick={() => onCopy(link)}><Copy /></IconButton>
        <IconButton label={`${link.viewCount ?? 0} views`}><BarChart3 /></IconButton>
        <IconButton label="Edit settings" onClick={() => onEdit(link)}><Settings2 /></IconButton>
        <IconButton label={active ? "Deactivate link" : "Activate link"} onClick={() => onToggle(link)}>{active ? <ToggleRight className="text-primary" /> : <ToggleLeft />}</IconButton>
        <IconButton label="Delete link" onClick={() => onDelete(link)} destructive><Trash2 /></IconButton>
      </div>
    </div>
  </article>;
}

function Status({ active, expired }: { active: boolean; expired: boolean }) { return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{active ? "• Active" : expired ? "• Expired" : "• Inactive"}</span>; }
function IconButton({ children, label, onClick, destructive }: { children: React.ReactNode; label: string; onClick?: () => void; destructive?: boolean }) { return <Button variant="ghost" size="icon" className={`h-8 w-8 ${destructive ? "text-destructive hover:text-destructive" : ""}`} aria-label={label} title={label} onClick={onClick}>{children}</Button>; }
function titleFor(link: SharedLink) { return typeof link.contentId === "string" ? "Shared content" : link.contentId.title; }
