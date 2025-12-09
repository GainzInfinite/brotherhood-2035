import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CalendarDashboard from "./CalendarDashboard"

export default async function CalendarPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/onboarding/welcome")

  // Fetch all daily logs for the user
  const dailyLogs = await prisma.dailyLog.findMany({
    where: {
      userId: user.id,
    },
    select: {
      date: true,
      weight: true,
      pushups: true,
      steps: true,
      meditationMinutes: true,
      readingMinutes: true,
      studyMinutes: true,
      spendToday: true,
      incomeToday: true,
      consistencyScore: true,
    },
    orderBy: {
      date: 'asc',
    }
  })

  // Fetch all journal entries for the user
  const journalEntries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      date: true,
      title: true,
    },
    orderBy: {
      date: 'asc',
    }
  })

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-cinzel">Calendar</h1>
        <p className="mt-2 text-muted-foreground font-body">
          Master your time. Review your consistency.
        </p>
      </div>
      
      <CalendarDashboard 
        dailyLogs={dailyLogs} 
        journalEntries={journalEntries}
        settings={userSettings}
      />
    </div>
  )
}
