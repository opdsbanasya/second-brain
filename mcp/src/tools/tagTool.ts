import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { api } from "../services/api.js";

export const registerTagTools = (server: McpServer) => {
  // Tool 1: List all tags
  server.registerTool(
    "get_tags",
    {
      description: "Get all tags stored in Second Brain",
      inputSchema: z.object({
        query: z.string().optional().describe("Optional filter query for tag names"),
      }),
    },
    async ({ query }) => {
      try {
        const response = await api.get(`tags?q=${encodeURIComponent(query || "")}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.tags || response, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching tags: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 2: Get content by tag
  server.registerTool(
    "get_content_by_tag",
    {
      description: "Retrieve Second Brain content items filtered by a specific tag",
      inputSchema: z.object({
        tag: z.string().describe("Tag name to filter by"),
      }),
    },
    async ({ tag }) => {
      try {
        const response = await api.get(`content/search?q=${encodeURIComponent(tag)}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.contents || response, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching content for tag "${tag}": ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
};
