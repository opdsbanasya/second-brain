import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import Header from './Header'

const MainLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background p-2 sm:p-3">
      <div className="sticky top-2 z-50 rounded-2xl border border-border bg-card shadow-sm">
        <Header />
      </div>
      <main className="mx-auto mt-4 min-h-[calc(100vh-7rem)] rounded-2xl border border-border bg-card p-4 sm:p-6">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}

export default MainLayout;
