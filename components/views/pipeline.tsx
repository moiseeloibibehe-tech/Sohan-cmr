"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Plus, Trash2 } from "lucide-react"
import { PageHeader, inputClass, primaryBtnClass } from "@/components/crm-ui"
import {
  STAGES,
  STAGE_COLOR,
  euros,
  type Contact,
  type Deal,
} from "@/lib/crm"
import { createDeal, updateDealStage, deleteDeal } from "@/app/actions/crm"

const empty = { title: "", value: "", contactId: "" }

export function Pipeline({
  deals,
  contacts,
}: {
  deals: Deal[]
  contacts: Contact[]
}) {
  const [dragId, setDragId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [, startTransition] = useTransition()

  function contactName(id: number | null) {
    return contacts.find((c) => c.id === id)?.name || "—"
  }

  function move(id: number, stage: string) {
    startTransition(async () => {
      await updateDealStage(id, stage)
    })
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteDeal(id)
    })
  }

  function addDeal(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    startTransition(async () => {
      await createDeal({
        title: form.title,
        value: Number.parseInt(form.value || "0", 10),
        contactId: form.contactId ? Number.parseInt(form.contactId, 10) : null,
      })
      setForm(empty)
      setShowForm(false)
    })
  }

  return (
    <div>
      <PageHeader
        title="Pipeline"
        subtitle="Glissez une affaire vers une autre étape"
      >
        <button className={primaryBtnClass} onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} /> Nouvelle affaire
        </button>
      </PageHeader>

      {showForm && (
        <form
          onSubmit={addDeal}
          className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-4"
        >
          <input
            required
            placeholder="Titre de l'affaire"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            type="number"
            min="0"
            placeholder="Montant (€)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className={inputClass}
          />
          <select
            value={form.contactId}
            onChange={(e) => setForm({ ...form, contactId: e.target.value })}
            className={inputClass}
          >
            <option value="">Contact (optionnel)</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className={`${primaryBtnClass} sm:col-span-4`}>
            Ajouter l&apos;affaire
          </button>
        </form>
      )}

      <div className="flex gap-3.5 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage)
          const total = stageDeals.reduce((s, d) => s + d.value, 0)
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, stage)}
              className="flex w-60 flex-shrink-0 flex-col"
            >
              <div
                className="mb-2.5 border-b-[3px] pb-2"
                style={{ borderColor: STAGE_COLOR[stage] }}
              >
                <div className="text-sm font-semibold text-foreground">{stage}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {euros(total)} · {stageDeals.length}
                </div>
              </div>
              <div className="flex min-h-16 flex-col gap-2">
                {stageDeals.map((d) => (
                  <div
                    key={d.id}
                    draggable
                    onDragStart={() => setDragId(d.id)}
                    className="group cursor-grab rounded-lg border border-border bg-card p-3 active:cursor-grabbing"
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="text-[13.5px] font-semibold text-foreground">
                        {d.title}
                      </div>
                      <button
                        onClick={() => remove(d.id)}
                        className="flex-shrink-0 text-destructive opacity-0 transition-opacity hover:opacity-70 group-hover:opacity-100"
                        aria-label={`Supprimer ${d.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="mb-1.5 text-xs text-muted-foreground">
                      {contactName(d.contactId)}
                    </div>
                    <div
                      className="font-mono text-[13px] font-semibold"
                      style={{ color: STAGE_COLOR[stage] }}
                    >
                      {euros(d.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
