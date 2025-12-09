import { prisma } from "@/lib/prisma"
import AnalyticsDashboard from "./AnalyticsDashboard"

async function getSettings() {
  const settings = await prisma.userSettings.findFirst()
  return settings
}

export default async function AnalyticsPage() {
  const settings = await getSettings()

  return <AnalyticsDashboard settings={settings} />
}
