import mongoose from "mongoose";
import type { TagsTypes } from "../types/Tags.js";

export const TagsSchema = new mongoose.Schema<TagsTypes>({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Tags = mongoose.model("Tags", TagsSchema);

export default Tags;