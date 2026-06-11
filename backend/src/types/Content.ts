import type mongoose from "mongoose";

export interface ContentTypes {
  title: string;
  link: string;
  contentType: string;
  tags?: string[];
  userId: mongoose.Schema.Types.ObjectId;
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentCreateBody = Omit<ContentTypes, "_id" | "createdAt" | "updatedAt">;

