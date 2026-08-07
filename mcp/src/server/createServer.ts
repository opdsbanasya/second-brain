import { McpServer } from "@modelcontextprotocol/server";
import { registerSearchTool } from "../tools/searchTool.js";
import { registerCreateNoteTool } from "../tools/createNoteTool.js";
import { registerTagTools } from "../tools/tagTool.js";
import { registerResources } from "../resources/index.js";
import { registerPrompts } from "../prompts/index.js";

export const createServer = () => {
  const server = new McpServer({
    name: "second-brain",
    version: "1.0.0",
  });

  server.registerTool(
    "ping",
    {
      description: "Ping the Second Brain MCP server",
    },
    async () => {
      return {
        content: [{ type: "text", text: "pong" }],
      };
    }
  );

  registerSearchTool(server);
  registerCreateNoteTool(server);
  registerTagTools(server);
  registerResources(server);
  registerPrompts(server);

  return server;
};