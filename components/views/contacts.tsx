"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Search, Plus, Trash2, Phone, Mail, Building2 } from "lucide-react"
import {
  PageHeader,
  Avatar,
  StatusPill,
  EmptyState,
  inputClass,
  primaryBtnClass,
} from "@/components/crm-ui"
import type { Contact } from "@/lib/crm"
import { createContact, deleteContact } from "@/app/actions/crm"

const empty = { name: "", company: "", email: "", phone: "", status: "Prospect" }

export function Contacts({ contacts }: { contacts: Contact[] }) {
  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [pending, startTransition] = useTransition()

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(query.toLowerCase()),
  )

  function addContact(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    startTransition(async () => {
      await createContact(form)
      setForm(empty)
      setShowForm(false)
    })
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteContact(id)
    })
  }

  return (
    <div>
      <PageHeader title="Contacts" subtitle={`${contacts.length} contacts au total`}>
        <button className={primaryBtnClass} onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} /> Nouveau contact
        </button>
      </PageHeader>

      <div className="relative mb-4 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un contact ou une entreprise…"
          className={`${inputClass} w-full pl-9`}
        />
      </div>

      {showForm && (
        <form
          onSubmit={addContact}
          className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2"
        >
          <input
            required
            placeholder="Nom complet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Entreprise"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Téléphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={inputClass}
          >
            <option>Prospect</option>
            <option>Client</option>
          </select>
          <button type="submit" disabled={pending} className={primaryBtnClass}>
            {pending ? "Ajout…" : "Ajouter"}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2.5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5"
          >
            <Avatar name={c.name} />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-foreground">{c.name}</div>
              <div className="mt-0.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-muted-foreground">
                {c.company && (
                  <span className="flex items-center gap-1">
                    <Building2 size={13} /> {c.company}
                  </span>
                )}
                {c.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={13} /> {c.email}
                  </span>
                )}
                {c.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} /> {c.phone}
                  </span>
                )}
              </div>
            </div>
            <StatusPill status={c.status} />
            <button
              onClick={() => remove(c.id)}
              disabled={pending}
              className="flex p-1.5 text-destructive transition-opacity hover:opacity-70 disabled:opacity-40"
              title="Supprimer"
              aria-label={`Supprimer ${c.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <EmptyState
            text={
              contacts.length === 0
                ? "Aucun contact pour le moment. Ajoutez votre premier contact."
                : "Aucun contact ne correspond à cette recherche."
            }
          />
        )}
      </div>
    </div>
  )
}
