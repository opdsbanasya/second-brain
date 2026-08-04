import { Link, NavLink } from "react-router";
import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Second Brain
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/privacy", label: "Privacy" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition ${isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Get started</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
