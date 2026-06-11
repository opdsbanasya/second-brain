import type { Request, Response } from "express"
import Content from "../models/Content.js";
import SharableLink from "../models/SharableLink.js";

export const createShareLink = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;
        const {user} = req;

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

        res.json({shareLink: `${process.env.BASE_URL}/share/${contentId}`})

    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}