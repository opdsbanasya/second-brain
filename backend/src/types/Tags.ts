import type mongoose from "mongoose";

export interface TagsTypes{
    name: string;
    _id: mongoose.Schema.Types.ObjectId;
    useCount: number;
}