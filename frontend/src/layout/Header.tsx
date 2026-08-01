import { Bell, Brain, LogOut, Search, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import api from "../lib/api";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const signOut = async () => {
    try { await api.post("/auth/logout"); } finally {
      dispatch(logout());
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
          <span className="text-sm font-semibold tracking-tight">Second Brain</span>
        </Link>

        {isAuthenticated ? <>
          <nav className="hidden items-center gap-1 md:flex">
            <HeaderLink to="/dashboard">Dashboard</HeaderLink>
            <HeaderLink to="/shared-links">Shared</HeaderLink>
          </nav>
          <div className="relative ml-auto hidden w-full max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search your second brain..." className="h-9 pl-9" />
          </div>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                <span className="max-w-28 truncate">{user?.name ?? "Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile"><User />Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                <LogOut />
                Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </> : <>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <HeaderLink to="/about">About</HeaderLink>
            <HeaderLink to="/contact">Contact</HeaderLink>
            <HeaderLink to="/privacy">Privacy</HeaderLink>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </>}
      </div>
    </header>
  )
}

function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <NavLink to={to} 
  className={({ isActive }) => 
  `rounded-md px-3 py-1.5 text-sm transition 
  ${isActive ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
    {children}
  </NavLink>;
}

export default Header
