# Roadmap: Building an MCP Server for Second Brain

This roadmap outlines the steps to build and distribute a Model Context Protocol (MCP) **Server** for the Second Brain application. By providing an MCP server, users can connect their Second Brain to external AI tools (like Claude Desktop, Cursor, Gemini, ChatGPT, etc.), allowing those AIs to seamlessly search, retrieve, edit, and analyze their saved notes, links, and resources.

---

## Phase 1: Authentication & API Foundation
Since the MCP server talks to our cloud/hosted REST API, we need a secure way to authenticate.
- [x] **Personal Access Tokens (PATs)**: Update the backend to allow users to generate, view, and revoke API keys / PATs from their profile dashboard.
- [x] **REST API / SDK Readiness**: Ensure the backend has clear, stable API endpoints for the MCP server to call (`GET /api/v1/content`, `GET /api/v1/tags`, `POST /api/v1/content`, `GET /api/v1/content/search`).
- [x] **Rate Limiting & Security**: Protect endpoints against abuse using `express-rate-limit`.

---

## Phase 2: MCP Server Initialization
- [x] **Setup Project**: Create a standalone Node.js/TypeScript project for the MCP server (`d:\Web Dev\second-brain\mcp`).
- [x] **Integrate MCP SDK**: Install `@modelcontextprotocol/server` (and `@modelcontextprotocol/sdk`) and configure standard project structure.
- [x] **Transport Layer**: Configure stdio (standard input/output) transport for local integrations with tools like Claude Desktop & MCP Inspector.
- [x] **Environment Variables**: Configure the server to accept `SECOND_BRAIN_API_KEY` and `SECOND_BRAIN_API_URL`.

---

## Phase 3: Core MCP Capabilities (v1 MVP)
- [x] **Tools (Actions)**:
  - `ping`: Health check tool.
  - `search_content`: Search Second Brain notes by keyword using regex fallback.
  - `get_content_by_tag`: Retrieve items associated with a specific tag.
  - `add_note`: Allow the AI to save a new note/article/document directly to Second Brain.
  - `get_tags`: Fetch all available tags.
- [x] **Resources (Data)**:
  - `secondbrain://tags`: List of all user tags.
  - `secondbrain://content/{id}`: Full text and metadata of a specific note by ID.
- [x] **Prompts (Templates)**:
  - `summarize_recent`: "Read my recent additions and summarize the main themes."
  - `brainstorm_ideas`: "Look at notes under a specific tag and suggest 3 new angles to explore."

---

## Phase 3.5: Next-Level & Advanced Agent Capabilities
Upgrade Second Brain from a simple bookmark app into a personal Knowledge Operating System for AI.

### 1. Next-Level Core Tools
- [ ] **`get_recent_content(days?: number)`**: Retrieve notes saved within the last N days (default 7 days).
- [ ] **`get_content_by_id(id: string)`**: Direct tool call for fetching a single note's full text.
- [ ] **`update_note(id: string, title?: string, description?: string, tags?: string[])`**: Allow AI to reformat, polish, or edit existing notes.
- [ ] **`delete_note(id: string)`**: Remove duplicate or obsolete notes.
- [ ] **`get_related_content(id: string)`**: Find content related by shared tags or semantic similarity.
- [ ] **`search_by_date_range(startDate: string, endDate: string)`**: Filter saved content by creation date.
- [ ] **`get_statistics()`**: Overview of total content items, content type distribution, and tag counts.

### 2. Advanced Agent Tools
- [ ] **`summarize_content(id: string)`**: Generate a structured summary of a specific note.
- [ ] **`generate_insights()`**: Extract top recurring topics, key takeaways, and patterns across all notes.
- [ ] **`find_gaps()`**: Analyze saved notes and highlight knowledge gaps (e.g. "You have many notes on React & MCP, but minimal content on FastAPI").

### 3. Additional Resources
- [ ] `secondbrain://recent`: Read-only view of recent notes.
- [ ] `secondbrain://stats`: Read-only statistics overview.
- [ ] `secondbrain://tag/{name}`: Read-only feed for a specific tag.

### 4. Additional Prompts
- [ ] **`weekly_review`**: "Review everything I saved this week and generate actionable insights."
- [ ] **`create_learning_plan`**: "Look at my saved resources and create a step-by-step learning roadmap."
- [ ] **`startup_ideas`**: "Analyze notes under my 'ideas' tag and generate 3 startup concepts."
- [ ] **`write_blog`**: "Draft a technical blog post synthesizing my saved notes on a given topic."
- [ ] **`prepare_interview`**: "Use my saved DSA and System Design notes to generate interview practice questions."

---

## Phase 4: Testing & Validation
- [x] **MCP Inspector**: Test tools, resources, and prompts locally using `@modelcontextprotocol/inspector` and `@mcpjam/inspector`.
- [x] **JSON-RPC Handshake Validation**: Verify stdio responses for `initialize`, `tools/list`, `tools/call`, `resources/list`, and `prompts/list`.
- [ ] **Claude Desktop Integration**: Connect local MCP server to Claude Desktop via `claude_desktop_config.json`.

---

## Phase 5: Remote MCP Server & OAuth 2.0 Integration
Transition from local stdio transport to a hosted Remote MCP Server so users can connect via URL without installing node locally.
- [ ] **HTTP / SSE Transport**: Implement Streamable HTTP (SSE) transport for remote connections.
- [ ] **OAuth 2.0 Authentication**: Add OAuth 2.0 flow so users can authorize AI apps with one-click "Add Custom Connector" UI.
- [ ] **Deployment**: Host Remote MCP Server endpoint on cloud infrastructure.

---

## Phase 6: Distribution & Documentation
- [ ] **NPM Packaging**: Publish the MCP server as an npm package (`npx @secondbrain/mcp-server`) or Docker image.
- [ ] **User Guides**: Create step-by-step documentation for connecting Claude Desktop, Cursor, ChatGPT, and custom MCP clients.
- [ ] **In-App Integration Hub**: Add an "MCP Integration" section to the Second Brain user dashboard with copy-paste configuration snippets.
