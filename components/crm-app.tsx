"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CheckSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import type { Contact, Deal, Task } from "@/lib/crm"
import { signOut } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/views/dashboard"
import { Contacts } from "@/components/views/contacts"
import { Pipeline } from "@/components/views/pipeline"
import { Tasks } from "@/components/views/tasks"
import { initials } from "@/lib/crm"

const NAV = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: KanbanSquare },
  { id: "tasks", label: "Tâches", icon: CheckSquare },
] as const

type Page = (typeof NAV)[number]["id"]

export function CrmApp({
  user,
  contacts,
  deals,
  tasks,
}: {
  user: { name: string; email: string }
  contacts: Contact[]
  deals: Deal[]
  tasks: Task[]
}) {
  const router = useRouter()
  const [page, setPage] = useState<Page>("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push("/sign-in")
    router.refresh()
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const Icon = n.icon
        const active = page === n.id
        return (
          <button
            key={n.id}
            onClick={() => {
              setPage(n.id)
              setMobileOpen(false)
            }}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon size={17} />
            {n.label}
          </button>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 flex-col bg-sidebar p-3.5 md:flex">
        <div className="mb-8 px-2.5 pt-3 font-display text-lg font-bold text-[#f6f7f4]">
          Sohan<span className="text-accent">CRM</span>
        </div>
        {nav}
        <div className="mt-auto flex flex-col gap-3 border-t border-sidebar-border px-1 pt-4">
          <div className="flex items-center gap-2.5 px-1">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-semibold text-primary-foreground">
              {initials(user.name || user.email)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-[#f6f7f4]">
                {user.name}
              </div>
              <div className="truncate text-xs text-sidebar-foreground">
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-sidebar px-4 py-3 md:hidden">
        <div className="font-display text-lg font-bold text-[#f6f7f4]">
          Sohan<span className="text-accent">CRM</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-sidebar-foreground"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[52px] z-20 flex flex-col bg-sidebar p-4 md:hidden">
          {nav}
          <button
            onClick={handleSignOut}
            className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-5 pb-10 pt-20 md:px-10 md:pt-8">
        {page === "dashboard" && (
          <Dashboard contacts={contacts} deals={deals} tasks={tasks} />
        )}
        {page === "contacts" && <Contacts contacts={contacts} />}
        {page === "pipeline" && <Pipeline deals={deals} contacts={contacts} />}
        {page === "tasks" && <Tasks tasks={tasks} contacts={contacts} />}
      </main>
    </div>
  )
}
