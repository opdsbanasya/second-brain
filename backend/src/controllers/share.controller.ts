import type { Request, Response } from "express"
import Content from "../models/Content.js";
import SharableLink from "../models/SharableLink.js";

export const createShareLink = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;
        const { user } = req;

        if(!contentId) {
            return res.status(400).json({message: "Content ID is required"});
        }

        const content = await SharableLink.create({
            contentId,
            userId: user._id,
        });

        if (!content) {
            return res.status(404).json({message: "Content not found"});
        }

        res.status(201).json({shareLink: `${process.env.BASE_URL}/share/${contentId}`})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const getSharedContent = async (req: Request, res: Response) => {
    try {
        // read the id from the url
        const { id } = req.params;

        // check if the link is valid and not expired
        const shareLink = await SharableLink.findById(id);

        if (!shareLink) {
            return res.status(404).json({message: "Share link not found"});
        }

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

export const deleteShareLink = async (req: Request, res: Response) => {
    try {
        // read the id from the url
        const { id } = req.params;

        // check if the link is valid and not expired
        const shareLink = await SharableLink.findById(id);

        if (!shareLink) {
            return res.status(404).json({message: "Share link not found"});
        }

        // delete the share link from the database
        await SharableLink.findByIdAndDelete(id);

        // send response with success message
        res.json({message: "Share link deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}