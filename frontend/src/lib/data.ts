// Mock data for the Second Brain app — swap with real API calls later.
// All fetch calls should use `credentials: 'include'` for HTTP-only JWT cookies.

export type ContentType = "article" | "link" | "note" | "video" | "podcast" | "book" | "course" | "other";

export interface Tag {
  id: string;
  name: string;
  color: "blue" | "green" | "pink" | "amber" | "violet" | "rose" | "teal" | "slate";
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  type: ContentType;
  tagIds: string[];
  createdAt: string;
}

export interface SharedLink {
  id: string;
  contentId: string;
  url: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export const currentUser: User = {
  id: "u_1",
  name: "Ava Chen",
  email: "ava@example.com",
  role: "admin",
};

export const tags: Tag[] = [
  { id: "t1", name: "Design",      color: "violet" },
  { id: "t2", name: "Engineering", color: "blue" },
  { id: "t3", name: "Productivity",color: "green" },
  { id: "t4", name: "Reading",     color: "amber" },
  { id: "t5", name: "Inspiration", color: "pink" },
  { id: "t6", name: "AI",          color: "teal" },
  { id: "t7", name: "Startup",     color: "rose" },
  { id: "t8", name: "Archive",     color: "slate" },
];

export const contentItems: ContentItem[] = [
  {
    id: "c1",
    title: "The art of writing small, focused components",
    description:
      "A short essay on why splitting UI into tiny, single-purpose components leads to systems that scale — and a few heuristics for knowing when to split.",
    link: "https://example.com/small-components",
    type: "article",
    tagIds: ["t1", "t2"],
    createdAt: "2026-06-10T09:00:00Z",
  },
  {
    id: "c2",
    title: "Glassmorphism, used sparingly",
    description:
      "Frosted glass surfaces are a fantastic accent — but they ruin readability when applied to the entire UI. Use them on floating layers only.",
    type: "note",
    tagIds: ["t1", "t5"],
    createdAt: "2026-06-09T11:30:00Z",
  },
  {
    id: "c3",
    title: "TanStack Start: server functions in practice",
    description:
      "A walkthrough of building typed RPC endpoints with createServerFn, including auth middleware and shared validators.",
    link: "https://example.com/tanstack-start",
    type: "link",
    tagIds: ["t2", "t6"],
    createdAt: "2026-06-08T17:45:00Z",
  },
  {
    id: "c4",
    title: "How I run a weekly review in 20 minutes",
    description:
      "My lightweight weekly review template: three columns, no apps, only a notebook and a timer.",
    type: "note",
    tagIds: ["t3"],
    createdAt: "2026-06-07T08:15:00Z",
  },
  {
    id: "c5",
    title: "A founder's reading list for year one",
    description:
      "Eight books that shaped how I think about product, distribution, and team dynamics during the earliest stages.",
    link: "https://example.com/reading-list",
    type: "article",
    tagIds: ["t4", "t7"],
    createdAt: "2026-06-05T14:00:00Z",
  },
  {
    id: "c6",
    title: "Designing for trust in AI products",
    description:
      "Patterns for surfacing model uncertainty, attributing sources, and giving users meaningful control without overwhelming them.",
    link: "https://example.com/ai-trust",
    type: "article",
    tagIds: ["t1", "t6"],
    createdAt: "2026-06-03T20:10:00Z",
  },
  {
    id: "c7",
    title: "Talk: The hidden cost of dependencies",
    description:
      "Conference talk on long-term maintenance costs of npm dependencies — recording plus the speaker's slide deck.",
    link: "https://example.com/talk",
    type: "video",
    tagIds: ["t2", "t8"],
    createdAt: "2026-05-30T10:00:00Z",
  },
  {
    id: "c8",
    title: "A short note on saying no",
    description:
      "Saying no is a design decision. A two-minute reminder I revisit whenever the backlog feels heavier than it should.",
    type: "note",
    tagIds: ["t3", "t5"],
    createdAt: "2026-05-28T07:20:00Z",
  },
];

export const sharedLinks: SharedLink[] = [
  { id: "s1", contentId: "c1", url: "https://brain.app/s/abc123", createdAt: "2026-06-11T10:00:00Z" },
  { id: "s2", contentId: "c5", url: "https://brain.app/s/def456", createdAt: "2026-06-10T16:30:00Z" },
];

export const users: User[] = [
  { id: "u_1", name: "Ava Chen",     email: "ava@example.com",     role: "admin" },
  { id: "u_2", name: "Marcus Lee",   email: "marcus@example.com",  role: "user"  },
  { id: "u_3", name: "Priya Patel",  email: "priya@example.com",   role: "user"  },
  { id: "u_4", name: "Diego Alvarez",email: "diego@example.com",   role: "user"  },
];

export const tagById = (id: string) => tags.find((t) => t.id === id);
