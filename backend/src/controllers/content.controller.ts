import type { Request, Response } from "express";
import Content from "../models/Content.js";
import type { ContentCreateBody } from "../types/Content.js";
import Tags from "../models/Tags.js";
import mongoose from "mongoose";
import { mdToPdf } from "md-to-pdf";

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
    for (const tagName of tags) {
      await Tags.findOneAndUpdate(
        { name: tagName.toLowerCase() },
        { $inc: { useCount: 1 } },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    throw new Error("Failed to check and create tags");
  }
};

const decrementTagsUsage = async (tags: string[]) => {
  try {
    for (const tagName of tags) {
      await Tags.findOneAndUpdate(
        { name: tagName.toLowerCase() },
        { $inc: { useCount: -1 } }
      );
    }
  } catch (error) {
    console.error("Failed to decrement tags usage:", error);
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContentById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findOne({
      _id: id as any,
      userId: req.user!._id as any,
    }).populate("userId", "name email");

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

    const content = await Content.findOne({
      _id: id as any,
      userId: req.user!._id as any,
    });
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

    if (tags !== undefined) {
      const oldTags = content.tags || [];
      const newTags = tags;
      
      const addedTags = newTags.filter(t => !oldTags.includes(t));
      const removedTags = oldTags.filter(t => !newTags.includes(t));

      if (addedTags.length > 0) await checkAndCreateTags(addedTags);
      if (removedTags.length > 0) await decrementTagsUsage(removedTags);
    }

    const updates = Object.fromEntries(
      Object.entries({ title, link, contentType, tags, description }).filter(
        ([, value]) => value !== undefined,
      ),
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

    const content = await Content.findOne({
      _id: id as any,
      userId: req.user!._id as any,
    });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    if (content.tags && content.tags.length > 0) {
      await decrementTagsUsage(content.tags);
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
    const query = req.rawQuery as string;

    // search in db using regex (title, description, tags)
    const results = await Content.find({
      userId: req.user!._id as any,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    })
      .populate("userId", "name email")
      .maxTimeMS(2000)
      .limit(100);

    // send
    res.json({ contents: results });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const exportContentToPdf = async (req: Request, res: Response) => {
  try {
    // Read contentId from query (or fallback to body)
    const contentId = (req.query.contentId || req.query.id || req.body?.contentId) as string;

    if (!contentId) {
      return res.status(400).json({ message: "contentId is required in query parameter" });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: "Invalid contentId format" });
    }

    // Fetch details from DB
    const content = await Content.findOne({
      _id: contentId as any,
      userId: req.user!._id as any,
    });

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const { title, description, link, tags } = content;

    // Clean unwanted trailing backslashes from editor linebreaks/soft-breaks
    const cleanDescription = (description || "")
      .replace(/\\+(\s*\r?\n)/g, "$1")
      .replace(/\\+\s*$/gm, "");

    let markdown = `# ${title || "Untitled"}\n\n`;
    if (link) {
      markdown += `**Link:** [${link}](${link})\n\n`;
    }
    if (Array.isArray(tags) && tags.length > 0) {
      markdown += `**Tags:** ${tags.map((t: string) => `\`#${t}\``).join(" ")}\n\n`;
    }
    markdown += `---\n\n${cleanDescription}`;

    const customCss = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #0f172a;
        line-height: 1.65;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #0f172a;
        font-weight: 700;
        margin-top: 1.2em;
        margin-bottom: 0.4em;
      }
      p {
        margin: 0.6em 0;
      }
      hr {
        border: none !important;
        border-top: 1px solid #e2e8f0 !important;
        height: 0 !important;
        margin: 20px 0 24px 0 !important;
        clear: both !important;
      }
      pre {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 14px 18px !important;
        margin: 16px 0 !important;
        overflow-x: auto !important;
        page-break-inside: avoid !important;
      }
      pre code.hljs,
      pre code {
        background: transparent !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        padding: 0 !important;
        border: none !important;
      }
      code:not(pre code) {
        background: #f1f5f9 !important;
        color: #0f172a !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        border: 1px solid #e2e8f0 !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        font-size: 0.9em !important;
      }
      blockquote {
        border-left: 3px solid #cbd5e1 !important;
        background: #f8fafc !important;
        padding: 10px 16px !important;
        border-radius: 4px !important;
        color: #475569 !important;
        margin: 1em 0 !important;
      }
      table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 1em 0 !important;
      }
      table th, table td {
        border: 1px solid #e2e8f0 !important;
        padding: 8px 12px !important;
      }
      table th {
        background: #f8fafc !important;
      }
    `;

    const pdf = await mdToPdf(
      { content: markdown },
      {
        css: customCss,
        highlight_style: "github",
        launch_options: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
        pdf_options: {
          format: "A4",
          margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
          printBackground: true,
        },
      }
    );

    const safeTitle = (title || "document")
      .trim()
      .replace(/[^a-zA-Z0-9_\-\s]/g, "")
      .replace(/\s+/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeTitle || "document"}.pdf"`
    );
    res.setHeader("Content-Length", pdf.content.length);
    return res.send(pdf.content);
  } catch (error) {
    console.error("Failed to export PDF with md-to-pdf:", error);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};
