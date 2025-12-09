import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth()
  
  // If logged in, redirect to command center
  if (session?.user) {
    redirect("/command-center")
  }
  
  // If not logged in, redirect to landing page
  redirect("/landing")
}
