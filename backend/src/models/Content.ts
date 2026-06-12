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
      required: true,
      unique: true,
    },
    contentType: {
      type: String,
      enum: ["link", "article", "video", "podcast", "book", "course", "other"],
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
    },
  },
  {
    timestamps: true,
  },
);

const Content = mongoose.model("Content", ContentSchema);

export default Content;
