import { McpServer } from "@modelcontextprotocol/server";

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

  return server;
};