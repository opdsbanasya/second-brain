import { useState, useEffect } from "react";
import { Bell, Brain, LogOut, Search, User, Globe } from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/slices/authSlice";
import { searchContents, fetchContents } from "../store/slices/contentSlice";
import api from "../lib/api";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [query, setQuery] = useState("");

  // Debounce search API calls by 300ms
  useEffect(() => {
    // Skip initial mount empty query if not intended
    const timer = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchContents(query));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (location.pathname !== "/dashboard" && value.trim()) {
      navigate("/dashboard");
    }
    if (!value.trim()) {
      dispatch(fetchContents());
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
    if (query.trim()) {
      dispatch(searchContents(query));
    } else {
      dispatch(fetchContents());
    }
  };

  const signOut = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      dispatch(logoutUser());
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Second Brain
          </span>
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              <HeaderLink to="/dashboard">Dashboard</HeaderLink>
              <HeaderLink to="/shared-links">Shared</HeaderLink>
            </nav>
            <form onSubmit={handleSearchSubmit} className="relative ml-auto hidden w-full max-w-sm md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={handleSearchChange}
                placeholder="Search your second brain..."
                className="h-9 pl-9"
              />
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="max-w-28 truncate font-medium">
                    {user?.name ?? "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/dashboard">
                    <Brain className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/shared-links">
                    <Globe className="mr-2 h-4 w-4" />
                    Shared Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <nav className="ml-auto hidden items-center gap-1 md:flex">
              <HeaderLink to="/dashboard">Dashboard</HeaderLink>
              <HeaderLink to="/shared-links">Shared</HeaderLink>
              <HeaderLink to="/#pricing">Pricing</HeaderLink>
              <HeaderLink to="/#mcp">Docs</HeaderLink>
              <HeaderLink to="/about">About</HeaderLink>
            </nav>
            <div className="ml-auto flex items-center gap-2 md:ml-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-[#4F46E5] text-white hover:bg-[#4338CA] font-medium shadow-xs">
                <Link to="/register">Start Free</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

function HeaderLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-1.5 text-sm transition 
  ${isActive ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`
      }
    >
      {children}
    </NavLink>
  );
}

export default Header;
