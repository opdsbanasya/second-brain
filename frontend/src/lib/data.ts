// Mock data for the Second Brain app — swap with real API calls later.
// All fetch calls should use `credentials: 'include'` for HTTP-only JWT cookies.

export type ContentType = "article" | "link" | "note" | "video" | "podcast" | "book" | "course" | "other";

export interface Tag {
  id: string;
  name: string;
  color: "blue" | "green" | "pink" | "amber" | "violet" | "rose" | "teal" | "slate";
  useCount?: number;
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


