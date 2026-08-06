import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server/createServer.js";

void serveStdio(createServer);
