import mongoose from "mongoose";

interface ContentTypes {
  title: string;
  link: string;
  contentType: string;
  tags?: string[];
  userId: mongoose.Schema.Types.ObjectId;
}

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
      enum: ["Link", "Article", "Video", "Podcast", "Book", "Course", "Other"],
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
  },
  {
    timestamps: true,
  },
);

const Content = mongoose.model("Content", ContentSchema);

export default Content;
