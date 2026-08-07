import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { api } from "../services/api.js";

export const registerSearchTool = (server: McpServer) => {
  server.registerTool(
    "search_content",
    {
      description: "Search user's Second Brain for notes, links, and documents matching a query",
      inputSchema: z.object({
        query: z.string().describe("Search query term"),
      }),
    },
    async ({ query }) => {
      try {
        const response = await api.get(`content/search?q=${encodeURIComponent(query)}`);
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
              text: `Error searching content: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
};
