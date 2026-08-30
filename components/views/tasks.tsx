"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Circle, CheckCircle2, Plus, Trash2 } from "lucide-react"
import {
  PageHeader,
  EmptyState,
  inputClass,
  primaryBtnClass,
} from "@/components/crm-ui"
import type { Contact, Task } from "@/lib/crm"
import { createTask, toggleTask, deleteTask } from "@/app/actions/crm"

const empty = { title: "", due: "", contactId: "" }

export function Tasks({
  tasks,
  contacts,
}: {
  tasks: Task[]
  contacts: Contact[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [, startTransition] = useTransition()

  function contactName(id: number | null) {
    return contacts.find((c) => c.id === id)?.name || "—"
  }

  const sorted = [...tasks].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) ||
      (a.due || "9999").localeCompare(b.due || "9999"),
  )

  function toggle(id: number, done: boolean) {
    startTransition(async () => {
      await toggleTask(id, done)
    })
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteTask(id)
    })
  }

  function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    startTransition(async () => {
      await createTask({
        title: form.title,
        due: form.due || null,
        contactId: form.contactId ? Number.parseInt(form.contactId, 10) : null,
      })
      setForm(empty)
      setShowForm(false)
    })
  }

  return (
    <div>
      <PageHeader
        title="Tâches"
        subtitle={`${tasks.filter((t) => !t.done).length} tâches en cours`}
      >
        <button className={primaryBtnClass} onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} /> Nouvelle tâche
        </button>
      </PageHeader>

      {showForm && (
        <form
          onSubmit={addTask}
          className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-4"
        >
          <input
            required
            placeholder="Intitulé de la tâche"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            type="date"
            value={form.due}
            onChange={(e) => setForm({ ...form, due: e.target.value })}
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
            Ajouter la tâche
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            style={{ opacity: t.done ? 0.6 : 1 }}
          >
            <button
              onClick={() => toggle(t.id, !t.done)}
              className={`flex ${t.done ? "text-primary" : "text-muted-foreground"}`}
              aria-label={t.done ? "Marquer comme non terminée" : "Marquer comme terminée"}
            >
              {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <div className="flex-1">
              <div
                className={`text-sm font-medium text-foreground ${
                  t.done ? "line-through" : ""
                }`}
              >
                {t.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {contactName(t.contactId)}
              </div>
            </div>
            {t.due && (
              <div className="font-mono text-xs text-muted-foreground">
                {new Date(t.due).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                })}
              </div>
            )}
            <button
              onClick={() => remove(t.id)}
              className="flex text-destructive opacity-0 transition-opacity hover:opacity-70 group-hover:opacity-100"
              aria-label={`Supprimer ${t.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <EmptyState text="Aucune tâche pour le moment. Créez votre première tâche." />
        )}
      </div>
    </div>
  )
}
