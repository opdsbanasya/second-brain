import mongoose from "mongoose";
import type { ContentTypes } from "../types/Content.js";

const ContentSchema = new mongoose.Schema<ContentTypes>(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ["note", "link", "article", "video", "podcast", "book", "course", "document", "other"],
      required: true,
    },
    tags: {
      type: [String],
      ref: "Tags",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Content = mongoose.model("Content", ContentSchema);

export default Content;
