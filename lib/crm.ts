export const STAGES = [
  "Prospection",
  "Qualification",
  "Proposition",
  "Négociation",
  "Gagné",
] as const

export type Stage = (typeof STAGES)[number]

export const STAGE_COLOR: Record<string, string> = {
  Prospection: "#8a93c7",
  Qualification: "#c98a3b",
  Proposition: "#b9762e",
  Négociation: "#1f5c4a",
  Gagné: "#2f7a5c",
}

export function euros(n: number) {
  return n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export type Contact = {
  id: number
  name: string
  company: string | null
  email: string | null
  phone: string | null
  status: string
}

export type Deal = {
  id: number
  contactId: number | null
  title: string
  stage: string
  value: number
}

export type Task = {
  id: number
  contactId: number | null
  title: string
  due: string | null
  done: boolean
}
