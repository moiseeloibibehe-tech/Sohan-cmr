"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { contacts, deals, tasks } from "@/lib/db/schema"
import { and, asc, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// ---------- Reads ----------
export async function getContacts() {
  const userId = await getUserId()
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(asc(contacts.name))
}

export async function getDeals() {
  const userId = await getUserId()
  return db
    .select()
    .from(deals)
    .where(eq(deals.userId, userId))
    .orderBy(desc(deals.createdAt))
}

export async function getTasks() {
  const userId = await getUserId()
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(asc(tasks.due))
}

// ---------- Contacts ----------
export async function createContact(input: {
  name: string
  company?: string
  email?: string
  phone?: string
  status?: string
}) {
  const userId = await getUserId()
  if (!input.name?.trim()) throw new Error("Le nom est requis.")
  await db.insert(contacts).values({
    userId,
    name: input.name.trim(),
    company: input.company?.trim() || null,
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    status: input.status || "Prospect",
  })
  revalidatePath("/")
}

export async function deleteContact(id: number) {
  const userId = await getUserId()
  await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
  revalidatePath("/")
}

// ---------- Deals ----------
export async function createDeal(input: {
  title: string
  value: number
  stage?: string
  contactId?: number | null
}) {
  const userId = await getUserId()
  if (!input.title?.trim()) throw new Error("Le titre est requis.")
  await db.insert(deals).values({
    userId,
    title: input.title.trim(),
    value: Number.isFinite(input.value) ? input.value : 0,
    stage: input.stage || "Prospection",
    contactId: input.contactId ?? null,
  })
  revalidatePath("/")
}

export async function updateDealStage(id: number, stage: string) {
  const userId = await getUserId()
  await db
    .update(deals)
    .set({ stage })
    .where(and(eq(deals.id, id), eq(deals.userId, userId)))
  revalidatePath("/")
}

export async function deleteDeal(id: number) {
  const userId = await getUserId()
  await db.delete(deals).where(and(eq(deals.id, id), eq(deals.userId, userId)))
  revalidatePath("/")
}

// ---------- Tasks ----------
export async function createTask(input: {
  title: string
  due?: string | null
  contactId?: number | null
}) {
  const userId = await getUserId()
  if (!input.title?.trim()) throw new Error("Le titre est requis.")
  await db.insert(tasks).values({
    userId,
    title: input.title.trim(),
    due: input.due || null,
    contactId: input.contactId ?? null,
  })
  revalidatePath("/")
}

export async function toggleTask(id: number, done: boolean) {
  const userId = await getUserId()
  await db
    .update(tasks)
    .set({ done })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath("/")
}

export async function deleteTask(id: number) {
  const userId = await getUserId()
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath("/")
}
