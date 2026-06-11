import mongoose from "mongoose";

interface TagsTypes{
    name: string;
}

export const TagsSchema = new mongoose.Schema<TagsTypes>({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Tags = mongoose.model("Tags", TagsSchema);

export default Tags;