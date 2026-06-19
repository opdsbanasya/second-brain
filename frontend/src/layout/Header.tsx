import React from 'react'
import { BiBell, BiBrain, BiPlus } from 'react-icons/bi'
import { Link } from 'react-router'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

const Header = () => {
  return (
    <header className="glass sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BiBrain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Second Brain</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            // activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-accent text-accent-foreground font-medium" }}
          >
            Dashboard
          </Link>
          <Link
            to="/shared-links"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            // activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-accent text-accent-foreground font-medium" }}
          >
            Shared
          </Link>
        </nav>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            // value={query}
            // onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search your second brain..."
            className="h-9 pl-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Notifications">
          <BiBell className="h-4 w-4" />
        </Button>

        <Button onClick={()=>{}} className="gap-1.5">
          <BiPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>    
    </header>
  )
}

export default Header