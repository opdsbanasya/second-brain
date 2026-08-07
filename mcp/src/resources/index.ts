import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { api } from "../services/api.js";

export const registerResources = (server: McpServer) => {
  // Resource 1: Static resource for all tags
  server.registerResource(
    "all-tags",
    "secondbrain://tags",
    {
      title: "All Second Brain Tags",
      description: "List of all tags stored in your Second Brain",
      mimeType: "application/json",
    },
    async (uri: URL) => {
      try {
        const response = await api.get("tags");
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(response.tags || response, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify({ error: error.message }),
            },
          ],
        };
      }
    }
  );

  // Resource 2: Dynamic resource template for content by ID
  server.registerResource(
    "content-by-id",
    new ResourceTemplate("secondbrain://content/{id}", { list: undefined }),
    {
      title: "Content Item by ID",
      description: "Retrieve full text and details of a specific note or article by ID",
      mimeType: "application/json",
    },
    async (uri: URL, { id }: any) => {
      try {
        const response = await api.get(`content/${id}`);
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(response.content || response, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify({ error: error.message }),
            },
          ],
        };
      }
    }
  );
};
