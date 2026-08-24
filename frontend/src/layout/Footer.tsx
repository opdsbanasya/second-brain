// import { Link } from "@radix-ui/react-navigation-menu";
import { Brain, ExternalLink } from "lucide-react";
import { BiBrain } from "react-icons/bi";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Second Brain
              </span>
            </Link>
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
                  to="https://www.iamdharm.me/"
                  className="hover:text-[#0F172A] transition-colors"
                >
                  Portfolio
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
  );
};

export default Footer;

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
