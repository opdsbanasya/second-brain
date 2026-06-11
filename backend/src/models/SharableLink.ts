import mongoose from "mongoose";

interface SharableLinkTypes {
    hash: string;
    contentId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    expiresAt: Date;
}

const SharableLinkSchema = new mongoose.Schema<SharableLinkTypes>({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

const SharableLink = mongoose.model("SharableLink", SharableLinkSchema);

export default SharableLink;