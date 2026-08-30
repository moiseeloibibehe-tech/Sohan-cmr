"use client"

import { PageHeader } from "@/components/crm-ui"
import { STAGES, STAGE_COLOR, euros, type Contact, type Deal, type Task } from "@/lib/crm"

export function Dashboard({
  contacts,
  deals,
  tasks,
}: {
  contacts: Contact[]
  deals: Deal[]
  tasks: Task[]
}) {
  const totalValue = deals.reduce((s, d) => s + d.value, 0)
  const wonDeals = deals.filter((d) => d.stage === "Gagné")
  const won = wonDeals.reduce((s, d) => s + d.value, 0)
  const openTasks = tasks.filter((t) => !t.done).length
  const clients = contacts.filter((c) => c.status === "Client").length

  const stats = [
    { label: "Pipeline total", value: euros(totalValue), sub: `${deals.length} affaires` },
    { label: "Gagné", value: euros(won), sub: `${wonDeals.length} affaires closes` },
    { label: "Tâches ouvertes", value: String(openTasks), sub: `sur ${tasks.length} au total` },
    { label: "Clients actifs", value: String(clients), sub: `sur ${contacts.length} contacts` },
  ]

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de votre activité" />

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>
            <div className="my-1 font-mono text-2xl font-bold text-foreground">
              {s.value}
            </div>
            <div className="text-sm text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-base font-semibold text-foreground">
          Répartition du pipeline
        </h2>
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage)
          const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
          const pct = totalValue ? (stageValue / totalValue) * 100 : 0
          return (
            <div key={stage} className="mb-3.5 last:mb-0">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-foreground">{stage}</span>
                <span className="font-mono text-muted-foreground">
                  {euros(stageValue)} · {stageDeals.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: STAGE_COLOR[stage] }}
                />
              </div>
            </div>
          )
        })}
        {deals.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune affaire pour le moment. Ajoutez-en depuis l&apos;onglet Pipeline.
          </p>
        )}
      </div>
    </div>
  )
}
