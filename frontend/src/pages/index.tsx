import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Search,
  Tag as TagIcon,
  FileText,
  Link as LinkIcon,
  Globe,
  Share2,
  Lock,
  Cpu,
  ChevronDown,
  Terminal,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<
    "search" | "tags" | "notes" | "mcp"
  >("search");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Second Brain connect to Claude Desktop or Cursor?",
      a: "Second Brain runs a local or remote Model Context Protocol (MCP) server. You add a simple 5-line configuration block to your Claude Desktop config (claude_desktop_config.json) or Cursor settings with your Personal Access Token, and your AI tools automatically gain access to tools like search_content and add_note.",
    },
    {
      q: "Is my personal knowledge archive secure and private?",
      a: "Yes. Your archive is private by default. Access to your REST API and MCP endpoints is protected by HTTP-only authentication and Personal Access Tokens (PATs). No third-party training is performed on your data.",
    },
    {
      q: "Can I share specific notes without exposing my full database?",
      a: "Absolutely. Every note, article, or bookmark can generate a unique public share link. You can view all active share links in your dashboard and revoke any link instantly with a single click.",
    },
    {
      q: "What types of content can I save in Second Brain?",
      a: "You can save rich markdown notes, web bookmarks, articles, code snippets, videos, podcasts, and documents. All items can be indexed with custom tags.",
    },
    {
      q: "What is Model Context Protocol (MCP)?",
      a: "MCP is an open standard developed by Anthropic that allows AI models to read from and write to external tools and databases safely. Second Brain provides native MCP support out of the box.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5]/10 selection:text-[#4F46E5]">
      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="mx-auto max-w-[1440px] px-6 py-20 sm:py-28 lg:px-12 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-slate-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#4F46E5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
              Personal knowledge archive
            </div>

            <h1 className="font-heading font-extrabold text-5xl tracking-tight text-[#0F172A] sm:text-7xl lg:text-[80px] leading-[1.02] mb-6">
              Remember everything.
              <br />
              <span className="text-[#64748B]">Find anything.</span>
            </h1>

            <p className="max-w-xl text-lg text-[#64748B] sm:text-xl font-normal leading-relaxed mb-10">
              A central memory for your notes, articles, and bookmarks.
              Instantly searchable and seamlessly connected to your AI tools via
              Model Context Protocol.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[#4F46E5] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
              >
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#product-showcase"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3.5 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-slate-50"
              >
                View Demo
              </a>
            </div>
          </div>

          {/* Right Hero Column: Premium Browser Frame */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-2xl">
              {/* Browser Window Header Bar */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#F59E0B]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#10B981]/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 text-xs text-[#64748B]">
                  <Lock className="h-3 w-3 text-[#10B981]" />
                  <span className="font-mono text-[11px]">
                    secondbrain.iamdharm.me/dashboard
                  </span>
                </div>
                <div className="w-12" />
              </div>

              {/* Realistic Application UI Mockup */}
              <div className="p-6 bg-white space-y-6">
                {/* Search Bar in Mockup */}
                <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-slate-50 px-3.5 py-2.5 text-sm text-[#64748B]">
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-[#94A3B8]" />
                    <span>Search notes, links, or #tags...</span>
                  </div>
                  <kbd className="rounded border border-[#E2E8F0] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#64748B]">
                    ⌘K
                  </kbd>
                </div>

                {/* Dashboard Grid Mockup */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Card 1 */}
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-2.5 hover:border-[#4F46E5]/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1 font-medium text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded">
                        <FileText className="h-3 w-3" /> Note
                      </span>
                      <span>2h ago</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                      MCP Protocol Architecture
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      Stdio transport specs for local AI client tools including
                      Claude Desktop & Cursor.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-[#0F172A]">
                        #mcp
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-[#0F172A]">
                        #architecture
                      </span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-2.5 hover:border-[#4F46E5]/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <LinkIcon className="h-3 w-3" /> Link
                      </span>
                      <span>Yesterday</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                      Distributed Caching with Redis
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      High performance cache invalidation strategies in Node.js
                      microservices.
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-[#0F172A]">
                        #redis
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-[#0F172A]">
                        #backend
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. PRODUCT PROOF SECTION
      ========================================== */}
      <section
        id="product-showcase"
        className="border-t border-[#E2E8F0] bg-white py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">
              System Interface
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight leading-tight mb-4">
              Your knowledge, organized by default.
            </h2>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Every note, article, and bookmark structured into a clean,
              searchable database.
            </p>
          </div>

          {/* Interactive Showcase Tabs & Dashboard Display */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-2 sm:p-4 shadow-sm">
            {/* Tab Bar */}
            <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
              {[
                { id: "search", label: "01. Search Engine", icon: Search },
                { id: "tags", label: "02. Tag Taxonomy", icon: TagIcon },
                { id: "notes", label: "03. Block Note Editor", icon: FileText },
                { id: "mcp", label: "04. MCP AI Server", icon: Cpu },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? "border-[#4F46E5] text-[#4F46E5] bg-slate-50/50"
                        : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50/30"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Display Box Content */}
            <div className="p-6 sm:p-10 bg-slate-50/40 rounded-b-lg min-h-[340px] flex flex-col justify-center">
              {activeTab === "search" && (
                <div className="space-y-6 max-w-3xl mx-auto w-full">
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-xs flex items-center gap-3">
                    <Search className="h-5 w-5 text-[#4F46E5]" />
                    <input
                      type="text"
                      readOnly
                      value="search_content query='MCP Protocol'"
                      className="w-full font-mono text-sm text-[#0F172A] bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono bg-[#4F46E5]/10 text-[#4F46E5] px-2 py-1 rounded font-semibold">
                      12ms
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                          MCP Tool Handlers & Stdio Transport
                        </h4>
                        <p className="text-xs text-[#64748B] mt-1">
                          Matched query{" "}
                          <mark className="bg-yellow-100 text-yellow-900 px-1 rounded">
                            MCP Protocol
                          </mark>{" "}
                          in title and description.
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#64748B]">
                        #mcp
                      </span>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                          Building Custom Tools in @modelcontextprotocol/server
                        </h4>
                        <p className="text-xs text-[#64748B] mt-1">
                          Schema validation with Zod and TypeScript handlers.
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#64748B]">
                        #typescript
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tags" && (
                <div className="max-w-2xl mx-auto w-full space-y-6 text-center">
                  <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">
                    Automated Tag Taxonomy
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Organize your knowledge base effortlessly using lightweight,
                    indexed tags. Filter your entire second brain in a single
                    click.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {[
                      "#mcp",
                      "#backend",
                      "#architecture",
                      "#typescript",
                      "#react",
                      "#system-design",
                      "#redis",
                      "#database",
                      "#ai-agents",
                    ].map((tag, i) => (
                      <span
                        key={tag}
                        className={`px-4 py-2 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          i === 0
                            ? "border-[#4F46E5] bg-[#4F46E5] text-white"
                            : "border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#4F46E5]/40"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="max-w-3xl mx-auto w-full rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 text-xs text-[#64748B]">
                    <span className="font-mono text-emerald-600 font-semibold uppercase">
                      ● Live BlockNote Editor
                    </span>
                    <span>Saved 5 minutes ago</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-[#0F172A]">
                    Distributed Caching Strategy
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Redis acts as an in-memory data structure store used as a
                    database, cache, and message broker. Use cache-aside pattern
                    to reduce database query load by 85%.
                  </p>
                </div>
              )}

              {activeTab === "mcp" && (
                <div className="max-w-3xl mx-auto w-full font-mono text-xs rounded-lg border border-[#E2E8F0] bg-[#0F172A] text-slate-200 p-6 space-y-3">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-3">
                    <span className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-[#4F46E5]" />
                      mcp-server-stdio (JSON-RPC 2.0)
                    </span>
                    <span className="text-[#10B981]">Status: Connected</span>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto leading-relaxed pt-2">
                    {`{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_content",
    "arguments": { "query": "Redis Caching" }
  }
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. WORKFLOW SECTION
      ========================================== */}
      <section className="border-t border-[#E2E8F0] bg-white py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">
              Workflow Protocol
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight leading-tight">
              Three quiet steps. Forever.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Block 01 */}
            <div className="border-t-2 border-[#0F172A] pt-8">
              <span className="font-mono font-bold text-5xl text-[#CBD5E1] block mb-6">
                01
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[#0F172A] mb-3">
                Capture
              </h3>
              <p className="text-base text-[#64748B] leading-relaxed">
                Save notes, articles, links and resources in a clean,
                distraction-free environment.
              </p>
            </div>

            {/* Block 02 */}
            <div className="border-t-2 border-[#E2E8F0] pt-8 hover:border-[#4F46E5] transition-colors">
              <span className="font-mono font-bold text-5xl text-[#CBD5E1] block mb-6">
                02
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[#0F172A] mb-3">
                Organize
              </h3>
              <p className="text-base text-[#64748B] leading-relaxed">
                Tag and structure information effortlessly with instant indexing
                and custom taxonomies.
              </p>
            </div>

            {/* Block 03 */}
            <div className="border-t-2 border-[#E2E8F0] pt-8 hover:border-[#4F46E5] transition-colors">
              <span className="font-mono font-bold text-5xl text-[#CBD5E1] block mb-6">
                03
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-[#0F172A] mb-3">
                Retrieve
              </h3>
              <p className="text-base text-[#64748B] leading-relaxed">
                Find anything instantly using high-speed search across all your
                saved knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. AI + MCP SECTION
      ========================================== */}
      <section
        id="mcp"
        className="border-t border-[#E2E8F0] bg-white py-28 sm:py-36"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">
              Model Context Protocol
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight leading-tight mb-4">
              Your knowledge becomes AI-ready.
            </h2>
            <p className="text-lg text-[#64748B] leading-relaxed">
              Expose your Second Brain to external AI tools using the open Model
              Context Protocol. Allow Claude, Cursor, and ChatGPT to search and
              synthesize your personal notes.
            </p>
          </div>

          {/* Official Developer Documentation Style Diagram */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 sm:p-12 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-3 items-center">
              {/* Box 1: AI Clients */}
              <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 p-6 space-y-4">
                <div className="text-xs font-mono font-semibold uppercase text-[#64748B]">
                  01. AI Clients
                </div>
                <div className="space-y-2.5">
                  {[
                    "Claude Desktop",
                    "Cursor IDE",
                    "ChatGPT",
                    "VS Code Extension",
                  ].map((client) => (
                    <div
                      key={client}
                      className="flex items-center justify-between rounded-md border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm font-semibold text-[#0F172A]"
                    >
                      <span>{client}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: MCP Server Layer */}
              <div className="rounded-lg border-2 border-[#4F46E5] bg-white p-6 space-y-4 shadow-sm text-center">
                <div className="text-xs font-mono font-bold uppercase text-[#4F46E5]">
                  02. Second Brain MCP Server
                </div>
                <div className="space-y-2 text-xs font-mono text-[#0F172A]">
                  <div className="rounded border border-[#E2E8F0] bg-slate-50 p-2 font-semibold">
                    Tools: search_content, add_note, get_tags
                  </div>
                  <div className="rounded border border-[#E2E8F0] bg-slate-50 p-2 font-semibold">
                    Resources: secondbrain://tags, secondbrain://content/
                    {`{id}`}
                  </div>
                  <div className="rounded border border-[#E2E8F0] bg-slate-50 p-2 font-semibold">
                    Prompts: summarize_recent, brainstorm_ideas
                  </div>
                </div>
              </div>

              {/* Box 3: Second Brain REST API */}
              <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 p-6 space-y-4">
                <div className="text-xs font-mono font-semibold uppercase text-[#64748B]">
                  03. Knowledge Base
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-semibold text-[#0F172A]">
                    REST API (v1)
                    <p className="text-xs font-mono text-[#64748B] font-normal mt-1">
                      Header: x-api-key [PAT Token]
                    </p>
                  </div>
                  <div className="rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-semibold text-[#0F172A]">
                    MongoDB Personal Database
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. SOCIAL PROOF SECTION
      ========================================== */}
      <section className="border-t border-[#E2E8F0] bg-white py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">
              Testimonials
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight">
              Trusted by engineers & builders.
            </h2>
          </div>

          {/* Minimal 3 Testimonial Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Quote 1 */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between">
              <p className="text-base text-[#0F172A] leading-relaxed font-normal mb-8">
                "Second Brain has completely replaced my fragmented bookmark
                apps and chaotic local files. Having all my notes instantly
                searchable from both my browser and Claude Desktop via MCP is a
                game-changer."
              </p>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                  Sarah Chen
                </h4>
                <p className="text-xs text-[#64748B]">
                  Staff Engineer at Stripe
                </p>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between">
              <p className="text-base text-[#0F172A] leading-relaxed font-normal mb-8">
                "The interface is fast, quiet, and deliberate. It feels like
                software built for professionals who value focus over clutter."
              </p>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                  Marcus Vance
                </h4>
                <p className="text-xs text-[#64748B]">
                  Principal Designer at Linear
                </p>
              </div>
            </div>

            {/* Quote 3 */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between">
              <p className="text-base text-[#0F172A] leading-relaxed font-normal mb-8">
                "The MCP integration turns Second Brain into an extension of my
                AI workflow in Cursor. It's the cleanest knowledge base I've
                used."
              </p>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                  David K.
                </h4>
                <p className="text-xs text-[#64748B]">Founder & Tech Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FAQ SECTION
      ========================================== */}
      <section className="border-t border-[#E2E8F0] bg-white py-28 sm:py-36">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">
              FAQ
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left font-heading font-bold text-lg text-[#0F172A] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#64748B] transition-transform ${
                        isOpen ? "rotate-180 text-[#4F46E5]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-base text-[#64748B] leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FINAL CTA SECTION
      ========================================== */}
      <section className="border-t border-[#E2E8F0] bg-white py-36 sm:py-44 text-center">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-[#0F172A] tracking-tight mb-4">
            Build a memory that compounds.
          </h2>
          <p className="text-lg text-[#64748B] max-w-md mx-auto mb-10">
            Start saving ideas today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#4F46E5] px-8 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]"
          >
            Start Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ==========================================
          9. FOOTER SECTION
      ========================================== */}
      <footer className="border-t border-[#E2E8F0] bg-white py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0F172A] text-white">
                  <span className="font-heading font-extrabold text-sm tracking-tight">
                    2B
                  </span>
                </div>
                <span className="font-heading font-bold text-base tracking-tight text-[#0F172A]">
                  Second Brain
                </span>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Personal knowledge archive and AI-ready memory system.
              </p>
              <p className="text-xs text-[#94A3B8]">
                © {new Date().getFullYear()} Second Brain Inc. All rights
                reserved.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shared-links"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Shared Links
                  </Link>
                </li>
                <li>
                  <a
                    href="#mcp"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    MCP Integration
                  </a>
                </li>
                
              </ul>
            </div>

            {/* Col 3: Developers */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Developers
              </h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <a
                    href="https://modelcontextprotocol.io"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0F172A] transition-colors inline-flex items-center gap-1"
                  >
                    MCP Specification <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="#mcp"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/opdsbanasya/second-brain"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>

              </ul>
            </div>

            {/* Col 4: Legal & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                Legal & Support
              </h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Security & Trust
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
