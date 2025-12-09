import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import JournalClient from "./JournalClient"

export default async function JournalPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/onboarding/welcome")

  const dateStr = searchParams.date || new Date().toISOString().split('T')[0]
  
  // Normalize date to UTC midnight for consistency
  const date = new Date(dateStr)
  // Ensure we are working with the start of the day in UTC or local?
  // Ideally we store dates as UTC midnight.
  // new Date('2023-01-01') creates a UTC midnight date.
  
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: date,
      }
    }
  })

  const recentEntries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: 'desc',
    },
    take: 10,
    select: {
      id: true,
      date: true,
      title: true,
      imageUrl: true,
      content: true, // We might need a snippet
    }
  })

  return (
    <div className="space-y-8">
      <div className="mt-2">
        <h1 className="text-3xl font-extrabold text-foreground font-cinzel tracking-tight">Journal</h1>
        <p className="mt-2 text-muted-foreground font-body font-medium">
          Record your journey, reflect on your progress, and clear your mind.
        </p>
      </div>
      
      <JournalClient 
        initialDate={date} 
        initialEntry={entry}
        recentEntries={recentEntries}
      />
    </div>
  )
}
