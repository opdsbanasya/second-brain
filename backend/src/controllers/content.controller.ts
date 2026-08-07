import type { Request, Response } from "express";
import Content from "../models/Content.js";
import type { ContentCreateBody } from "../types/Content.js";
import Tags from "../models/Tags.js";
import mongoose from "mongoose";

export const getAllContents = async (req: Request, res: Response) => {
  try {
    // Get User
    const { user } = req;

    // Fetch all contents for the user
    const contents = await Content.find({ userId: user._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // send response with contents
    res.json({ contents });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAndCreateTags = async (tags: string[]) => {
  try {
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
};

export const createContent = async (req: Request, res: Response) => {
  try {
    // read body
    const { title, link, contentType, tags, description }: ContentCreateBody =
      req.body;

    // read user
    const { user } = req;

    // validate body
    if (!title || !contentType) {
      return res
        .status(400)
        .json({ message: "Title and content type are required" });
    }

    // create Tags
    if (tags && tags.length > 0) await checkAndCreateTags(tags);

    // create content
    const contentData = {
      title,
      contentType,
      tags: tags || [],
      description: description || "",
      userId: user!._id,
    } as any;
    if (link) contentData.link = link;
    const content = await Content.create(contentData);

    // send response
    res.status(201).json({ content });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getContentById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findOne({ _id: id as any, userId: req.user!._id as any })
      .populate("userId", "name email");

    if (!content) {
      return res.status(404).json({ message: "Invalid content" });
    }

    res.json({ content });
  } catch (error) {
    console.error("Error fetching content by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateContentById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findOne({ _id: id as any, userId: req.user!._id as any });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const {
      title,
      link,
      contentType,
      tags,
      description,
    }: Partial<ContentCreateBody> = req.body;

    if (tags && tags.length > 0) await checkAndCreateTags(tags);

    const updates = Object.fromEntries(
      Object.entries({ title, link, contentType, tags, description }).filter(([, value]) => value !== undefined),
    );
    const updatedContent = await Content.findOneAndUpdate(
      { _id: id as any, userId: req.user!._id as any },
      updates as any,
      { new: true },
    );

    res.json({ content: updatedContent });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteContentById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findOne({ _id: id as any, userId: req.user!._id as any });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    await Content.findByIdAndDelete(content._id);
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchContent = async (req: Request, res: Response) => {
  try {
    // read query parameter (support both 'query' and 'q')
    const query = (req.query.query || req.query.q) as string;

    if (!query) return res.status(400).json({ message: "Query is required" });

    // search in db using regex (title, description, tags)
    const results = await Content.find({
      userId: req.user!._id as any,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    }).populate("userId", "name email");

    // send
    res.json({ contents: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};