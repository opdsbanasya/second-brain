# Second Brain

A modern, full-stack knowledge management platform for saving, organizing, and instantly retrieving notes, links, articles, and media. Built with a React frontend, Express/MongoDB backend, and an MCP (Model Context Protocol) server for AI-powered access through Claude Desktop, Cursor, and other MCP-compatible clients.

---

## ✨ Features

### Content Management
- **Multi-type content** — Save notes, links, articles, videos, podcasts, books, courses, and documents
- **Rich-text editing** — BlockNote-powered Notion-style editor with full Markdown support
- **Tag-based organization** — Categorize content with tags for rapid filtering
- **Full-text search** — Instant search across titles, descriptions, and tags
- **Inline editing** — Edit content directly from the detail page with auto-save (`Ctrl+S`)

### Sharing
- **Shareable links** — Generate unique public URLs for any content item
- **Link management** — Activate/deactivate links, set expiry dates, track view counts
- **Public viewing** — Anyone can view shared content without authentication

### Authentication & Security
- **JWT session management** — Secure HTTP-only cookies with configurable expiry
- **Password validation** — Enforces strong passwords (8+ chars, uppercase, lowercase, number, special character)
- **API key system** — Generate Personal Access Tokens (PATs) for programmatic access

### MCP Integration
- **AI-powered access** — Use Second Brain from Claude Desktop, Cursor IDE, or any MCP client
- **Tools** — `search_content`, `add_note`, `get_tags`, `get_content_by_tag`, `ping`
- **Resources** — Browse all tags and fetch content by ID
- **Prompts** — `summarize_recent` (last 5 notes), `brainstorm_ideas` (ideation from a tag)

---

## 🏗 Architecture

```
second-brain/
├── backend/          # Express.js REST API + MongoDB
├── frontend/         # React SPA (Vite + Tailwind CSS v4)
└── mcp/              # MCP Server (stdio transport)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, Redux Toolkit, React Router v7, BlockNote Editor, shadcn/ui, Radix UI, Axios |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose 9, JWT, bcrypt, cookie-parser, express-rate-limit |
| **MCP Server** | @modelcontextprotocol/server v2, Zod, dotenv |
| **Fonts** | Inter, Inter Tight, JetBrains Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- **npm** or **pnpm**

### 1. Clone the repository

```bash
git clone https://github.com/opdsbanasya/second-brain.git
cd second-brain
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=<your_port_number>
MONGODB_CONNECTION_STRING=<your_mongo_uri>
JWT_SECRET=<your-256-bit-secret>
JWT_EXPIRES_IN=<your>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the dev server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend automatically.

### 4. MCP Server Setup (Optional)

```bash
cd mcp
npm install
npm run build
```

Create a `.env` file:

```env
SECOND_BRAIN_API_URL=http://localhost:3000/api/v1/
SECOND_BRAIN_API_KEY=<your-api-key>
```

> Generate an API key from the **Profile → Settings & API** tab in the app.

#### Claude Desktop Integration

Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "second-brain": {
      "command": "node",
      "args": ["<path-to>/second-brain/mcp/dist/index.js"],
      "env": {
        "SECOND_BRAIN_API_KEY": "<YOUR_TOKEN>",
        "SECOND_BRAIN_API_URL": "http://localhost:3000/api/v1/"
      }
    }
  }
}
```

---

## 📡 API Reference

Base URL: `http://localhost:3000/api/v1`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive session cookie |
| `POST` | `/auth/logout` | Clear session cookie |

### Content (🔒 Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/content` | Create a new content item |
| `GET` | `/content` | Get all content for the current user |
| `GET` | `/content/search?q=` | Search content by query |
| `GET` | `/content/:id` | Get a specific content item |
| `PUT` | `/content/:id` | Update a content item |
| `DELETE` | `/content/:id` | Delete a content item |

### Tags (🔒 Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tags?q=` | Search/list tags |

### Shared Links

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/shared-links/public/:hash` | View shared content (public) |
| `GET` | `/shared-links` | 🔒 List user's shared links |
| `POST` | `/shared-links` | 🔒 Create a share link |
| `PATCH` | `/shared-links/:id` | 🔒 Update share link (expiry, active) |
| `DELETE` | `/shared-links/:id` | 🔒 Delete a share link |

### Users (🔒 Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/me` | Get current user profile |
| `PUT` | `/users/me` | Update name or password |

### API Keys (🔒 Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api-key` | Generate a new API key |
| `GET` | `/api-key` | List all API keys |
| `DELETE` | `/api-key/:keyId` | Revoke an API key |

### Authentication Methods

- **Cookie**: JWT stored in `token` HTTP-only cookie (set by login)
- **Bearer Token**: `Authorization: Bearer <jwt>`
- **API Key**: `x-api-key: <api-key>` header (for MCP / programmatic access)

---

## 🗂 Project Structure

<details>
<summary><strong>Backend</strong></summary>

```
backend/
├── index.ts                      # Express app entry point
└── src/
    ├── config/
    │   └── dbConfig.ts            # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.ts     # Register, login, logout
    │   ├── content.controller.ts  # CRUD + search for content
    │   ├── share.controller.ts    # Shareable link management
    │   ├── user.controller.ts     # Profile updates
    │   └── apiKeys.controller.ts  # API key generation
    ├── middlewares/
    │   └── authMiddleware.ts      # JWT + API key verification
    ├── models/
    │   ├── User.ts                # User schema
    │   ├── Content.ts             # Content schema
    │   ├── Tags.ts                # Tags schema
    │   ├── SharableLink.ts        # Share link schema
    │   └── APIKeys.ts             # API keys schema
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── content.route.ts
    │   ├── share.routes.ts
    │   ├── tags.route.ts
    │   ├── user.routes.ts
    │   └── apiKeys.route.ts
    ├── types/
    │   ├── User.ts
    │   ├── Content.ts
    │   └── Tags.ts
    └── utils/
        └── validation.ts          # Email & password validators
```

</details>

<details>
<summary><strong>Frontend</strong></summary>

```
frontend/
├── index.html
├── vite.config.ts
└── src/
    ├── App.tsx                    # Route definitions
    ├── main.tsx                   # React entry + providers
    ├── index.css                  # Global styles
    ├── components/
    │   ├── ContentCard.tsx        # Content list card
    │   ├── ContentModal.tsx       # Create/edit dialog
    │   ├── MarkdownContent.tsx    # Markdown renderer
    │   ├── RequireAuth.tsx        # Auth guard wrapper
    │   ├── TagBadge.tsx           # Tag pill component
    │   ├── TagSidebar.tsx         # Sidebar tag filter
    │   └── ui/                    # shadcn/ui primitives
    ├── hooks/
    │   ├── useContentActions.ts   # CRUD + share logic
    │   └── use-mobile.ts          # Responsive breakpoint
    ├── layout/
    │   ├── Header.tsx             # App header + search
    │   ├── Footer.tsx             # App footer
    │   └── MainLayout.tsx         # Layout wrapper
    ├── lib/
    │   ├── api.ts                 # Axios instance + interceptors
    │   ├── data.ts                # TypeScript interfaces + mock data
    │   └── utils.ts               # cn() utility
    ├── pages/
    │   ├── index.tsx              # Landing / marketing page
    │   ├── login.tsx              # Sign in page
    │   ├── register.tsx           # Sign up page
    │   ├── dashboard.tsx          # Main content dashboard
    │   ├── content-detail.tsx     # Notion-style content editor
    │   ├── shared-links.tsx       # Manage shared links
    │   ├── shared-content.tsx     # Public shared content view
    │   ├── profile.tsx            # Account settings + API keys
    │   ├── about.tsx              # About page
    │   ├── contact.tsx            # Contact page
    │   ├── privacy.tsx            # Privacy policy
    │   └── not-found.tsx          # 404 page
    └── store/
        ├── index.ts               # Redux store config
        ├── hooks.ts               # Typed useDispatch/useSelector
        └── slices/
            ├── authSlice.ts       # Auth state + thunks
            ├── contentSlice.ts    # Content CRUD thunks
            ├── tagSlice.ts        # Tag fetch thunk
            └── shareSlice.ts      # Share link thunk
```

</details>

<details>
<summary><strong>MCP Server</strong></summary>

```
mcp/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                   # stdio transport entry
    ├── config/
    │   └── env.ts                 # Zod-validated env config
    ├── server/
    │   └── createServer.ts        # MCP server factory
    ├── services/
    │   └── api.ts                 # HTTP client for backend API
    ├── tools/
    │   ├── searchTool.ts          # search_content tool
    │   ├── createNoteTool.ts      # add_note tool
    │   └── tagTool.ts             # get_tags + get_content_by_tag
    ├── resources/
    │   └── index.ts               # Tags + content-by-id resources
    ├── prompts/
    │   └── index.ts               # summarize_recent + brainstorm_ideas
    ├── types/                     # (empty — reserved)
    └── utils/                     # (empty — reserved)
```

</details>

---

## 🛠 Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start with hot-reload (tsx watch) |
| Build | `npm run build` | Compile TypeScript |
| Start | `npm run start` | Run compiled JS |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Vite dev server (port 5173) |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | ESLint check |
| Format | `npm run format` | Prettier format |

### MCP

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Run with tsx |
| Build | `npm run build` | Compile TypeScript |
| Start | `npm run start` | Run compiled JS |

---

## 📄 License

ISC
