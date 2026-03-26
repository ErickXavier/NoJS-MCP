#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

const server = new McpServer({
    name: "nojs-mcp",
    version: "1.11.0",
});

// Register all resources and tools
registerResources(server);
registerTools(server);

// Start server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
