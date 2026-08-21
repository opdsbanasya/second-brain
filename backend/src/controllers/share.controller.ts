import type { Request, Response } from "express"
import Content from "../models/Content.js";
import SharableLink from "../models/SharableLink.js";

export const createShareLink = async (req: Request, res: Response) => {
    try {
        const { contentId, expiresAt } = req.body;
        const { user } = req;

        if(!contentId) {
            return res.status(400).json({message: "Content ID is required"});
        }

        const content = await Content.findOne({ _id: contentId, userId: user!._id });
        if (!content) return res.status(404).json({message: "Content not found"});

        const expiry = expiresAt ? new Date(expiresAt) : undefined;
        if (expiry && Number.isNaN(expiry.getTime())) return res.status(400).json({ message: "Invalid expiration date" });

        const existingLink = await SharableLink.findOne({
            contentId,
            userId: user!._id,
            active: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });

        if (existingLink) {
            return res.status(200).json({ shareLink: existingLink });
        }

        const hash = crypto.randomUUID().replace(/-/g, "");

        const shareLink = await SharableLink.create({
            contentId,
            userId: user!._id,
            hash,
            url: `/s/${hash}`,
            ...(expiry ? { expiresAt: expiry } : {}),
        });
        res.status(201).json({ shareLink });
    } catch (error) {
        // console.log(error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const getSharedContent = async (req: Request, res: Response) => {
    try {
        // read the id from the url
        const { id } = req.params;
        if(!id){
            return res.status(400).json({message: "Share link ID is required"});
        }

        // check if the link is valid and not expired
        const shareLink = await SharableLink.findOne({ hash: id, active: true });

        if (!shareLink || (shareLink.expiresAt && shareLink.expiresAt <= new Date())) {
            return res.status(404).json({message: "Share link not found"});
        }

        shareLink.viewCount += 1;
        await shareLink.save();

        // get the content from the database using the id
        const content = await Content.findById(shareLink.contentId);

        if (!content) {
            return res.status(404).json({message: "Content not found"});
        }

        // send response with the content
        res.json({content});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getSharedLinks = async (req: Request, res: Response) => {
    try {
        const sharedLinks = await SharableLink.find({ userId: req.user!._id })
          .populate("contentId", "title")
          .sort({ createdAt: -1 });
        res.json({ sharedLinks });
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateShareLink = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { active, expiresAt } = req.body as { active?: boolean; expiresAt?: string | null };
        const shareLink = await SharableLink.findOne({ _id: id, userId: req.user!._id });
        if (!shareLink) return res.status(404).json({ message: "Share link not found" });

        if (typeof active !== "undefined") shareLink.active = active;
        if (typeof expiresAt !== "undefined") {
            if (expiresAt === null || expiresAt === "") shareLink.set("expiresAt", undefined);
            else {
                const expiry = new Date(expiresAt);
                if (Number.isNaN(expiry.getTime())) return res.status(400).json({ message: "Invalid expiration date" });
                shareLink.expiresAt = expiry;
            }
        }
        await shareLink.save();
        res.json({ shareLink });
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteShareLink = async (req: Request, res: Response) => {
    try {
        // read the id from the url
        const { id } = req.params;

        if(!id){
            return res.status(400).json({message: "Share link ID is required"});
        }
        
        // check if the link is valid and not expired
        const shareLink = await SharableLink.findOne({ _id: id, userId: req.user!._id });

        if (!shareLink) {
            return res.status(404).json({message: "Share link not found"});
        }

        // delete the share link from the database
        await SharableLink.findByIdAndDelete(shareLink._id);

        // send response with success message
        res.json({message: "Share link deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}
