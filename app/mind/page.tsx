import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MindDashboard from "./MindDashboard";

export default async function MindPage() {
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

  return <MindDashboard />;
}
