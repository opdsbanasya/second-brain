import type { NextFunction, Request, Response } from "express";
import validator from "validator";

export const contentvalidator = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, link, tags } = req.body;

        // Title Validation & Sanitization
        if (title) {
            if (typeof title !== "string") return res.status(400).json({ message: "Title must be a string" });
            if (!validator.isLength(title, { min: 1, max: 200 })) {
                return res.status(400).json({ message: "Title must be between 1 and 200 characters" });
            }
            req.body.title = validator.escape(validator.trim(title));
        }

        // Link Validation
        if (link) {
            if (typeof link !== "string") return res.status(400).json({ message: "Link must be a string" });
            if (!validator.isLength(link, { max: 2048 })) {
                return res.status(400).json({ message: "Link is too long" });
            }
            if(!validator.isURL(link)) {
                return res.status(400).json({ message: "Invalid URL" });
            }
            req.body.link = validator.trim(link);
        }

        // Description Validation & Markdown-safe Sanitization
        if (description) {
            if (typeof description !== "string") return res.status(400).json({ message: "Description must be a string" });
            if (!validator.isLength(description, { max: 20000 })) {
                return res.status(400).json({ message: "Description must be less than 20,000 characters" });
            }
            
            // Trim whitespace
            let sanitizedDesc = validator.trim(description);
            // Basic regex to strip script tags and inline event handlers to prevent trivial stored XSS
            // This preserves formatting like blockquotes (>) and html codeblocks for Markdown
            sanitizedDesc = sanitizedDesc.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
            sanitizedDesc = sanitizedDesc.replace(/javascript:/gi, "");
            sanitizedDesc = sanitizedDesc.replace(/on\w+="[^"]*"/gi, "");
            sanitizedDesc = sanitizedDesc.replace(/on\w+='[^']*'/gi, "");
            
            req.body.description = sanitizedDesc;
        }

        // Tags Validation & Sanitization
        if (tags) {
            if (!Array.isArray(tags)) return res.status(400).json({ message: "Tags must be an array" });
            if (tags.length > 50) return res.status(400).json({ message: "Too many tags" });
            
            const sanitizedTags = [];
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (typeof tag !== "string") return res.status(400).json({ message: "Each tag must be a string" });
                tag = validator.trim(tag);
                if (!validator.isLength(tag, { min: 1, max: 50 })) {
                    return res.status(400).json({ message: "Each tag must be between 1 and 50 characters" });
                }
                sanitizedTags.push(validator.escape(tag));
            }
            req.body.tags = sanitizedTags;
        }

        next();
    } catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({ message: "Internal server error during validation" });
    }
};