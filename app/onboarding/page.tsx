import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingWelcomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/onboarding/welcome");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  // A simple way to mark onboarding as complete is by visiting this page.
  // In a real app, this would be triggered by a form submission.
  if (userSettings && !userSettings.onboardingComplete) {
    await prisma.userSettings.update({
      where: { userId: user.id },
      data: { onboardingComplete: true },
    });
  } else if (!userSettings) {
    // Create settings if they don't exist
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        onboardingComplete: true,
        // Add other default settings here if needed
      },
    });
  }

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-foreground">Welcome to the Brotherhood</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Your onboarding is now complete. You are ready to begin the journey.
      </p>
      <p className="mt-2 text-muted-foreground">
        You will be redirected to the main dashboard shortly.
      </p>
      <meta httpEquiv="refresh" content="3;url=/" />
    </div>
  );
}
