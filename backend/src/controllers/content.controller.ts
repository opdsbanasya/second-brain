import type { Request, Response } from "express";
import Content from "../models/Content.js";
import type { ContentCreateBody } from "../types/Content.js";
import Tags from "../models/Tags.js";

export const getAllContents = async (req: Request, res: Response) => {
  try {
    // Get User
    const { user } = req;

    // Fetch all contents for the user
    const contents = await Content.find({ user: user._id });

    // send response with contents
    res.json({ contents });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAndCreateTags = async (tags: string[]) => {
    try{
        // Check if tags exist in the database, if not create them
        // Return the list of tag names (existing and newly created)

        for (const tagName of tags) {
            const existingTag = await Tags.findOne({ name: tagName });
            if (!existingTag) {
                await Tags.create({ name: tagName });
            }
        }

    } catch (error) {
        throw new Error("Failed to check and create tags");
    }
}

export const createContent = async (req: Request, res: Response) => {
    try {
        // read body
        const { title, link, contentType, tags }: ContentCreateBody = req.body;

        // read user
        const {user} = req;

        // validate body

        // create Tags
        if(tags && tags.length > 0) await checkAndCreateTags(tags);

        // create content
        const content = await Content.create({
            title,
            link,
            contentType,
            tags: tags || [],
            userId: user._id
        })

        // send response
        res.status(201).json({ content });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getContentById = async (req:Request, res: Response) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({message: "Content ID is required"});
        }

        const content = await Content.findById(id);
        if(!content) {
            return res.status(404).json({message: "Content not found"});
        }

        res.json({content});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateContentById = async (req:Request, res: Response) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({message: "Content ID is required"});
        }

        const content = await Content.findById(id);
        if(!content) {
            return res.status(404).json({message: "Content not found"});
        }

        const { title, link, contentType, tags }: Partial<ContentCreateBody> = req.body;

        if(tags && tags.length > 0) await checkAndCreateTags(tags);

        const updatedContent = await Content.findByIdAndUpdate(
            id,
            { title, link, contentType, tags },
            { new: true }
        );

        res.json({ content: updatedContent });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteContentById = async (req:Request, res: Response) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({message: "Content ID is required"});
        }

        const content = await Content.findById(id);
        if(!content) {
            return res.status(404).json({message: "Content not found"});
        }

        await Content.findByIdAndDelete(id);
        res.json({message: "Content deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

