import { Link, NavLink } from "react-router";
import { Brain, Search, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onCreate: () => void;
}

export function Navbar({ query, onQueryChange, onCreate }: NavbarProps) {
  return (
    // Glassmorphism — applied ONLY to this floating nav
    <header className="glass sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Second Brain</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `rounded-md px-3 py-1.5 text-sm ${isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/shared-links"
            className={({ isActive }) => `rounded-md px-3 py-1.5 text-sm ${isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
          >
            Shared
          </NavLink>
        </nav>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search your second brain..."
            className="h-9 pl-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <Button onClick={onCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>
    </header>
  );
}
