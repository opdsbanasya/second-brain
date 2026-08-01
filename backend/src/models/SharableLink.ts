import mongoose from "mongoose";

interface SharableLinkTypes {
  hash: string;
  contentId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  url: string;
  expiresAt?: Date;
  active: boolean;
  viewCount: number;
}

const SharableLinkSchema = new mongoose.Schema<SharableLinkTypes>(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
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
    active: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const SharableLink = mongoose.model("SharableLink", SharableLinkSchema);

export default SharableLink;
