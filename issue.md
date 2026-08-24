# 🔒 Backend Security Audit

> Full security analysis of the `backend/` codebase.  
> Severity: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## Issues

| # | Severity | Issue | Short Description | Location |
|---|----------|-------|-------------------|----------|
| 1 | 🔴 Critical | **Hardcoded Secrets in `.env`** | MongoDB connection string (with username & password) and a weak JWT secret are hardcoded in the `.env` file. If this file was ever committed to git, credentials are permanently exposed in history. | `.env` |
| 2 | 🔴 Critical | **Weak JWT Secret** | The JWT secret is a short, low-entropy hex-like string. It can be brute-forced, allowing an attacker to forge valid session tokens for any user. Use a cryptographically random secret (≥256 bits). | `.env` |
| 3 | 🔴 Critical | **NoSQL / Regex Injection in Search** | User-supplied `query` string is passed directly into `$regex` without escaping special regex characters. An attacker can craft payloads like `.*` or catastrophic backtracking patterns to perform ReDoS (regex denial-of-service) or exfiltrate data patterns. | `content.controller.ts` |
| 4 | 🔴 Critical | **NoSQL / Regex Injection in Tags** | Same `$regex` injection vulnerability — the `q` query parameter is passed raw into a MongoDB `$regex` filter without sanitisation. | `tags.route.ts` |
| 5 | 🟠 High | **API Key Stored in Plaintext** | API keys are stored as raw plaintext in the database. If the DB is compromised, all API keys are immediately usable. Keys should be hashed (like passwords) and only shown once at creation time. | `apiKeys.controller.ts`, `APIKeys.ts` |
| 6 | 🟠 High | **API Key Returned in Full on Every GET** | The `getAPIKey` endpoint returns the full plaintext key on every request. API keys should only be displayed once (at creation) and stored hashed afterwards. | `apiKeys.controller.ts` |
| 7 | 🟠 High | **Missing Owner Check on API Key Delete** | `deleteAPIKey` finds the key by `keyId` alone (`APIKey.findById(keyId)`) without filtering by `req.user._id`. Any authenticated user can delete another user's API key by guessing or enumerating the key's ObjectId. | `apiKeys.controller.ts` |
| 8 | 🟠 High | **No Request Body Size Limit** | `express.json()` is used without a `limit` option. An attacker can send extremely large JSON payloads (e.g. 100 MB) to exhaust server memory and cause denial-of-service. Add `express.json({ limit: '1mb' })`. | `index.ts` |
| 9 | 🟠 High | **Manual CORS — Missing Security Headers** | CORS is implemented manually instead of using the `cors` middleware. Critical security headers are missing: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `X-XSS-Protection`, `Content-Security-Policy`. Use `helmet` middleware. | `index.ts` |
| 10 | 🟠 High | **Wildcard CORS Origin Fallback** | When `CLIENT_URL` is not set, the origin defaults to `http://localhost:5173`. In production, if `CLIENT_URL` is not configured, the server may either block legitimate requests or, if set to `*`, allow any origin to make credentialed requests. | `index.ts` |
| 11 | 🟡 Medium | **No Rate Limiting on Auth Endpoints** | Login and register endpoints share the global limiter (100 req/15 min). Auth endpoints should have a much stricter dedicated rate limiter (e.g. 5-10 attempts/15 min) to prevent credential-stuffing and brute-force attacks. | `index.ts`, `auth.routes.ts` |
| 12 | 🟡 Medium | **Error Object Leaked to Client** | In `createContent` and `updateUser`, the raw `error` object is sent back in the JSON response. This can leak internal stack traces, file paths, and Mongoose schema details to attackers. | `content.controller.ts`, `user.controller.ts` |
| 13 | 🟡 Medium | **Tags Are Global, Not Per-User** | Tags are stored in a single shared collection without a `userId` field. Any authenticated user can see all tags created by any other user. This is an information disclosure / data isolation issue. | `Tags.ts`, `tags.route.ts`, `content.controller.ts` |
| 14 | 🟡 Medium | **No Input Sanitisation on Content Fields** | `title`, `description`, `link`, and `tags` from request bodies are stored directly into MongoDB without sanitisation or length limits. This opens the door to stored XSS (if rendered unsafely) and excessively large documents. | `content.controller.ts` |
| 15 | 🟡 Medium | **No Input Length Validation on User Name** | The `name` field during registration and update accepts arbitrary-length strings with no max-length check. An attacker can store megabytes of data in the name field. | `auth.controller.ts`, `user.controller.ts` |
| 16 | 🟡 Medium | **`JWT_EXPIRES_IN` Env Var Unused** | The `.env` file defines `JWT_EXPIRES_IN=7` but `setSessionCookie` hardcodes the expiry to `2 * 24 * 60 * 60` (2 days). The env var is misleading and the expiry is not configurable. | `.env`, `auth.controller.ts` |
| 17 | 🟡 Medium | **No Duplicate Email Error Handling** | If a user tries to register with an existing email, MongoDB throws a duplicate-key error which is caught generically and returned as `"Bad Request"` (400). The user gets no clear feedback, and the raw Mongo error is swallowed without specific handling. | `auth.controller.ts` |
| 18 | 🟢 Low | **`console.log` / `console.error` Leak Info in Production** | Multiple controllers use `console.log(error)` which can print sensitive data (DB queries, stack traces) to stdout/log files in production. Use a structured logger with level control. | `content.controller.ts`, `share.controller.ts`, `user.controller.ts`, `apiKeys.controller.ts` |
| 19 | 🟢 Low | **No Helmet / Security Headers Middleware** | The application does not use `helmet` or equivalent middleware. Missing headers like `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` leave the app vulnerable to clickjacking, MIME-sniffing, and protocol downgrade attacks. | `index.ts` |
| 20 | 🟢 Low | **No MongoDB Query Timeout / Index Strategy** | Regex-based search queries (`$regex`) without indexes on `title`, `description`, and `tags` can cause full collection scans, enabling slow-query DoS on large datasets. | `content.controller.ts` |

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 4 |
| 🟠 High | 6 |
| 🟡 Medium | 7 |
| 🟢 Low | 3 |
| **Total** | **20** |

---

# 🔒 Frontend Security Audit

> Full security analysis of the `frontend/` codebase.  
> Severity: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## Issues

| # | Severity | Issue | Short Description | Location |
|---|----------|-------|-------------------|----------|
| 1 | 🟠 High | **XSS via Markdown Rendering** | User-supplied `description` content is rendered through `react-markdown` with `remarkGfm`. While React escapes JSX by default, the custom `a` component renders `href` directly from user input (`href={href}`). A malicious `javascript:` URL in a markdown link (e.g. `[click](javascript:alert(1))`) could execute arbitrary JS. Add explicit URL scheme validation. | `MarkdownContent.tsx` |
| 2 | 🟠 High | **Shared Content Renders Untrusted Markdown** | The public shared content page (`/s/:sharedId`) renders markdown descriptions from content that could be authored by any user and shared publicly. Combined with the markdown XSS risk above, this creates a cross-user attack vector where a malicious user shares content containing XSS payloads viewable by unauthenticated visitors. | `shared-content.tsx` |
| 3 | 🟠 High | **Stale Token in localStorage Never Cleared on Expiry** | The Axios response interceptor detects `401` errors and removes `token` from `localStorage`, but this code is commented out (`// window.location.href = "/login"`). The user is never redirected, leaving the app in a broken authenticated state with an expired/invalid token visible in `localStorage`. | `api.ts` |
| 4 | 🟠 High | **Full API Keys Exposed in Frontend State** | The profile page fetches all API keys via `GET /api-key`, and the backend returns the full plaintext key. Even though the UI masks them (`••••••••••••` + last 4 chars), the full key lives in React component state and is accessible via DevTools. Frontend should never receive full keys — only a masked version. | `profile.tsx` |
| 5 | 🟡 Medium | **No Client-Side Input Sanitisation Before Submission** | Content creation (`useContentActions.ts` → `saveContent`) sends `title`, `description`, `link`, and `tags` directly to the API with only `.trim()`. No length limits, no URL validation on `link`, and no tag count limits. A user could submit megabytes of text or thousands of tags. | `useContentActions.ts` |
| 6 | 🟡 Medium | **Profile Page Sends to Wrong API Endpoint** | `updateName` in profile page sends `PUT /users/update`, but the backend route is `PUT /users/me`. This either silently fails or hits a 404. Password change also uses `/users/update` instead of `/users/me`. | `profile.tsx` |
| 7 | 🟡 Medium | **Auth Guard Bypassed in Header Navigation** | The `Header` component shows "Dashboard" and "Shared" nav links even when `isAuthenticated` is `false`. Clicking these links navigates to protected routes which then redirect to `/login`, creating a confusing UX and exposing route structure to unauthenticated users. | `Header.tsx` |
| 8 | 🟡 Medium | **Search Query Not URL-Encoded in Tag Fetch** | `fetchTags` in `tagSlice.ts` interpolates the `query` parameter directly into the URL string without `encodeURIComponent()`. Special characters like `#`, `&`, or `?` in a tag search term will break the URL or inject additional query parameters. | `tagSlice.ts` |
| 9 | 🟡 Medium | **Hardcoded Mock Data Left in Production Bundle** | `data.ts` exports hardcoded mock users, content items, shared links, and a `currentUser` with role `admin`. Even though these aren't used at runtime, they ship to the browser in the production JS bundle — leaking internal schema shapes, dummy email addresses, and the existence of an admin role. | `data.ts` |
| 10 | 🟡 Medium | **No Error Boundary at App Level** | There is no React Error Boundary wrapping the app. An unhandled render error in any component crashes the entire SPA with a white screen. The `lovable-error-reporting.ts` and `error-capture.ts` modules exist but are never wired into a boundary component. | `App.tsx`, `main.tsx` |
| 11 | 🟡 Medium | **External Unsplash Images on Auth Pages** | Login and register pages load avatar images from `images.unsplash.com` for the trust section. This creates a dependency on a third-party CDN — if Unsplash is blocked or down, broken images degrade trust. It also leaks user IP/referrer to Unsplash on every auth page visit. | `login.tsx`, `register.tsx` |
| 12 | 🟢 Low | **Clipboard Write Without Error Feedback** | `copyToClipboard` in `profile.tsx` calls `navigator.clipboard.writeText()` without a try/catch. On HTTP (non-HTTPS) or in iframes where clipboard API is unavailable, this will throw an unhandled promise rejection. The `useContentActions` hook does catch this, but the profile page does not. | `profile.tsx` |
| 13 | 🟢 Low | **Link `rel` Missing `noopener`** | External links in `MarkdownContent.tsx` and `ContentCard.tsx` use `rel="noreferrer"` but omit `noopener`. While modern browsers implicitly apply `noopener` with `noreferrer`, explicitly including both is a defence-in-depth best practice for older browser support. | `MarkdownContent.tsx`, `ContentCard.tsx` |
| 14 | 🟢 Low | **No `autocomplete` Attributes on Auth Forms** | Login and registration form inputs lack `autocomplete` attributes (e.g. `autocomplete="email"`, `autocomplete="current-password"`, `autocomplete="new-password"`). This degrades browser password manager integration and may cause credentials to be autofilled into wrong fields. | `login.tsx`, `register.tsx` |
| 15 | 🟢 Low | **`fetchContents` Race Condition on Search** | When a user types in the search bar (`Header.tsx`), a debounced `searchContents` is dispatched. But if the user clears the input, `fetchContents()` is dispatched immediately (no debounce). If a slow search response arrives after the fetch, stale search results overwrite the full content list. | `Header.tsx` |

---

## Summary

| Severity | Count |
|----------|-------|
| 🟠 High | 4 |
| 🟡 Medium | 7 |
| 🟢 Low | 4 |
| **Total** | **15** |

---

# 🔒 MCP Server Security Audit

> Full security analysis of the `mcp/` codebase.  
> Severity: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## Issues

| # | Severity | Issue | Short Description | Location |
|---|----------|-------|-------------------|----------|
| 1 | 🔴 Critical | **API Key Sent Over Both `x-api-key` AND `Authorization` Headers** | Every request sends the same `SECOND_BRAIN_API_KEY` in both `x-api-key` and `Authorization: Bearer` headers simultaneously. The `x-api-key` header is the intended auth mechanism for the backend's `authMiddleware`, but adding it as a `Bearer` token means the backend also tries to decode it as a JWT — this either silently fails or exposes the key to JWT verification error logs. Remove the redundant `Authorization` header. | `api.ts` |
| 2 | 🔴 Critical | **Potential SSRF via `SECOND_BRAIN_API_URL`** | The `SecondBrainApi` class constructs fetch URLs by directly concatenating `env.SECOND_BRAIN_API_URL` with the path (e.g. `content/${id}`). If a malicious actor can influence the `id` parameter (e.g. via the `content-by-id` resource template), they could inject path traversal characters (`../`) or full URLs to redirect requests to internal services. The `id` from the resource URI template is passed to `api.get()` without validation. | `api.ts`, `resources/index.ts` |
| 3 | 🟠 High | **No Input Validation on Resource `id` Parameter** | The `content-by-id` resource handler receives `id` as `any` type from the URI template and passes it directly to `api.get(\`content/${id}\`)`. No validation ensures `id` is a valid MongoDB ObjectId. An attacker could inject arbitrary path segments (e.g. `../../auth/login`) to hit unintended API endpoints. | `resources/index.ts` |
| 4 | 🟠 High | **`add_note` Tool Accepts Arbitrary Unvalidated `link` Input** | The `createNoteTool` accepts a `link` field as a free-form string (only `z.string().optional()`). No URL scheme validation is performed. A malicious LLM input could inject `javascript:`, `file:///`, or `data:` URLs that get stored in the database and rendered unsafely by the frontend. | `createNoteTool.ts` |
| 5 | 🟠 High | **`dist/` Directory Committed to Git** | The compiled `dist/` directory is present in the repository but listed in `.gitignore`. If `.gitignore` was added after an initial commit, the compiled output (including hardcoded paths and source maps) may already be tracked in git history. Source maps (`.js.map`) in production can leak the full original TypeScript source code. | `dist/`, `.gitignore` |
| 6 | 🟡 Medium | **Error Messages Leak Internal API Details** | All tool and resource error handlers return `error.message` directly to the MCP client (e.g. `Error creating note: ${error.message}`). The `api.ts` error includes the HTTP status code (`API Error: ${response.status}`). Combined, these can leak internal API endpoint paths, status codes, and server-side error details to the AI client, which may surface them to end users. | `createNoteTool.ts`, `searchTool.ts`, `tagTool.ts`, `resources/index.ts`, `prompts/index.ts` |
| 7 | 🟡 Medium | **No Timeout on `fetch` Requests** | The `SecondBrainApi` uses native `fetch()` without any `AbortController` timeout. If the backend becomes unresponsive, MCP tool calls will hang indefinitely, causing the AI client (Claude, Cursor) to freeze. Add a timeout (e.g. 10s) using `AbortSignal.timeout()`. | `api.ts` |
| 8 | 🟡 Medium | **`getCurrentUser()` Hits Non-Existent Endpoint** | `SecondBrainApi.getCurrentUser()` calls `this.get("/auth/me")`, but the backend has no `/auth/me` route — the user endpoint is `GET /users/me`. This method will always 404. If it's ever used, it creates confusing debug noise. | `api.ts` |
| 9 | 🟡 Medium | **No HTTPS Enforcement on API URL** | The `env.ts` schema validates `SECOND_BRAIN_API_URL` as `z.string().url()`, which accepts both `http://` and `https://`. In production, the API key would be sent in plaintext over HTTP. The schema should enforce `https://` or at minimum warn when `http://` is used outside localhost. | `env.ts` |
| 10 | 🟢 Low | **`get_content_by_tag` Uses Search Endpoint Instead of Tag Filter** | The `get_content_by_tag` tool calls `content/search?q=${tag}` — a full-text search, not a tag-specific filter. This returns content matching the tag name anywhere in title/description/tags, producing false positives. This is a logic bug with minor security implications (data leakage across tag boundaries). | `tagTool.ts` |

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 3 |
| 🟡 Medium | 4 |
| 🟢 Low | 1 |
| **Total** | **10** |

---

# 📊 Overall Project Summary

| Codebase | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | Total |
|----------|-------------|---------|-----------|--------|-------|
| Backend  | 4 | 6 | 7 | 3 | **20** |
| Frontend | 0 | 4 | 7 | 4 | **15** |
| MCP Server | 2 | 3 | 4 | 1 | **10** |
| **Grand Total** | **6** | **13** | **18** | **8** | **45** |
