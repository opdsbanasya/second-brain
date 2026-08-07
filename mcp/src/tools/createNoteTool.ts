import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { api } from "../services/api.js";

export const registerCreateNoteTool = (server: McpServer) => {
  server.registerTool(
    "add_note",
    {
      description: "Create and save a new note, link, or document in Second Brain",
      inputSchema: z.object({
        title: z.string().describe("Title of the note or content"),
        contentType: z
          .enum(["note", "link", "article", "video", "podcast", "book", "course", "document", "other"])
          .default("document")
          .describe("Type of content (note, link, article, video, podcast, book, course, document, other)"),
        description: z.string().optional().describe("Markdown content or body text"),
        link: z.string().optional().describe("Optional URL or link"),
        tags: z.array(z.string()).optional().describe("Array of tag names"),
      }),
    },
    async ({ title, contentType = "document", description, link, tags }) => {
      try {
        const response = await api.post("content", {
          title,
          contentType: contentType || "document",
          description: description || "",
          link: link || "",
          tags: tags || [],
        });

        return {
          content: [
            {
              type: "text",
              text: `Successfully created note: ${response.content?.title || title} (ID: ${response.content?._id || "created"})`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating note: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
};
