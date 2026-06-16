import { Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Second Brain</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A calm home for the notes, links, and articles you want to remember.
            </p>
          </div>

          <FooterCol title="Product" links={[
            { to: "/dashboard",     label: "Dashboard" },
            { to: "/shared-links",  label: "Shared links" },
            { to: "/",              label: "Pricing" },
          ]} />

          <FooterCol title="Company" links={[
            { to: "/about",   label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/",        label: "Careers" },
          ]} />

          <FooterCol title="Legal" links={[
            { to: "/privacy", label: "Privacy policy" },
            { to: "/privacy", label: "Terms of service" },
            { to: "/contact", label: "Support" },
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Second Brain. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground transition hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
