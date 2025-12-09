import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HealthDashboard from "./HealthDashboard";

export default async function HealthPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/onboarding/welcome");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || !dbUser.onboardingComplete) {
    redirect("/onboarding/welcome");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });
  
  return <HealthDashboard settings={userSettings} />;
}
