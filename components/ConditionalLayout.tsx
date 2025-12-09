"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import HeaderBar from "@/components/HeaderBar"
import TrialEndingModal from "@/components/TrialEndingModal"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Public routes that don't show the app shell
  const publicRoutes = ["/landing", "/auth/login", "/auth/signup"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  if (isPublicRoute) {
    return <>{children}</>
  }
  
  return (
    <>
      <div className="flex h-screen overflow-hidden pointer-events-auto">
        <Sidebar />
        <div className="flex flex-1 flex-col md:pl-64">
          <HeaderBar />
          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
      <TrialEndingModal />
    </>
  )
}
