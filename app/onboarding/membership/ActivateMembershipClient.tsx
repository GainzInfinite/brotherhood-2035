"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function ActivateMembershipClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const activate = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/onboarding/complete", { method: "POST" })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(data?.error || "Activation failed. Please try again.")
        setLoading(false)
        return
      }
      toast.success("Membership activated.")
      router.push("/command-center")
      router.refresh()
    } catch (e) {
      console.error(e)
      toast.error("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={activate}
      disabled={loading}
      className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-3 text-lg"
    >
      {loading ? "Activating..." : "Activate Brotherhood Membership"}
    </Button>
  )
}
