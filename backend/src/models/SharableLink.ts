import mongoose from "mongoose";

interface SharableLinkTypes {
  hash: string;
  contentId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  url: string;
  expiresAt: Date;
}

const SharableLinkSchema = new mongoose.Schema<SharableLinkTypes>(
  {
    hash: {
      type: String,
      // unique: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const SharableLink = mongoose.model("SharableLink", SharableLinkSchema);

export default SharableLink;
