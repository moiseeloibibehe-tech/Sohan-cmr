"use client"

import type React from "react"
import { initials } from "@/lib/crm"

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-primary-foreground"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const isClient = status === "Client"
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isClient
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-accent/30 bg-accent/10 text-[#946a22]"
      }`}
    >
      {status}
    </span>
  )
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

export const inputClass =
  "rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"

export const primaryBtnClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
