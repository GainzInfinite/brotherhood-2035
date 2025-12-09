import PrimaryCard from "@/components/PrimaryCard"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const authUser = await getCurrentUser()
  if (!authUser) redirect("/onboarding/welcome")

  const [dbUser, userSettings] = await Promise.all([
    prisma.user.findUnique({ where: { id: authUser.id } }),
    prisma.userSettings.findUnique({ where: { userId: authUser.id } })
  ])

  // Default settings if none exist
  const initialSettings = {
    enableFatherhoodModule: userSettings?.enableFatherhoodModule ?? false,
    currency: userSettings?.currency ?? "USD",
    weightUnit: userSettings?.weightUnit ?? "lbs",
    volumeUnit: userSettings?.volumeUnit ?? "liters",
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mt-2">
        <h1 className="text-3xl font-extrabold text-foreground font-cinzel tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground font-body font-medium">
          Configure your Brotherhood experience.
        </p>
      </div>

      <PrimaryCard title="Global Preferences">
        <SettingsForm 
          initialSettings={initialSettings} 
          initialTimezone={dbUser?.timezone ?? "UTC"} 
        />
      </PrimaryCard>
    </div>
  )
}
