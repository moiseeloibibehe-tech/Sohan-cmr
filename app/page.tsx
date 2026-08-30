import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getContacts, getDeals, getTasks } from "@/app/actions/crm"
import { CrmApp } from "@/components/crm-app"
import type { Contact, Deal, Task } from "@/lib/crm"

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const [contacts, deals, tasks] = await Promise.all([
    getContacts(),
    getDeals(),
    getTasks(),
  ])

  return (
    <CrmApp
      user={{ name: session.user.name, email: session.user.email }}
      contacts={contacts as Contact[]}
      deals={deals as Deal[]}
      tasks={tasks as Task[]}
    />
  )
}
