import { model, Schema } from "mongoose";

const APIKeySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    shortKey: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

APIKeySchema.index({ user: 1 });

export const APIKey = model("APIKey", APIKeySchema);
