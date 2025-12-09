"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export default function FloatingIncomeCTA() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/wealth/income/new')}
      aria-label="Add income"
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gold-500 to-gold-400 text-black font-semibold rounded-full shadow-2xl hover:scale-105 transform transition duration-200 focus:outline-none focus:ring-4 focus:ring-gold-400/30"
    >
      <Plus className="h-5 w-5" />
      <span className="font-medium">Add Income</span>
    </button>
  )
}
