import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { api } from "../services/api.js";

export const registerPrompts = (server: McpServer) => {
  // Prompt 1: Summarize recent items
  server.registerPrompt(
    "summarize_recent",
    {
      description: "Summarize your 5 most recently saved notes and documents",
    },
    async () => {
      try {
        const response = await api.get("content");
        const contents = response.contents || [];
        const recentText = contents
          .slice(0, 5)
          .map(
            (item: any, index: number) =>
              `${index + 1}. [${(item.contentType || "note").toUpperCase()}] ${item.title}\n   Description: ${item.description || "No description"}`
          )
          .join("\n\n");

        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Here are my recent additions to Second Brain:\n\n${recentText}\n\nPlease summarize the main topics and takeaways from these notes.`,
              },
            },
          ],
        };
      } catch (error: any) {
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Failed to load recent notes: ${error.message}`,
              },
            },
          ],
        };
      }
    }
  );

  // Prompt 2: Brainstorm ideas from a tag
  server.registerPrompt(
    "brainstorm_ideas",
    {
      description: "Brainstorm new ideas based on notes under a specific tag",
      argsSchema: {
        tag: z.string().describe("Tag name to brainstorm from (e.g. 'mcp' or 'ideas')"),
      },
    },
    async ({ tag }: { tag: string }) => {
      try {
        const response = await api.get(`content/search?q=${encodeURIComponent(tag)}`);
        const contents = response.contents || [];
        const notesList = contents
          .map((item: any) => `- Title: ${item.title}\n  Summary: ${item.description || "N/A"}`)
          .join("\n\n");

        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Here are my notes tagged with "${tag}":\n\n${notesList}\n\nBased on these notes, please suggest 3 new creative projects, expansion angles, or insights I should explore.`,
              },
            },
          ],
        };
      } catch (error: any) {
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Failed to load notes for tag "${tag}": ${error.message}`,
              },
            },
          ],
        };
      }
    }
  );
};
