import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Brotherhood 2035 - Elite Command Center for Life Mastery",
  description: "Transform your life with the ultimate dashboard for health, wealth, mind, and discipline. Join the brotherhood of high-performing men.",
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
