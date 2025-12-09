"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PrimaryCard from "@/components/PrimaryCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { timezones, getDetectedTimezone } from "@/lib/timezones"

export default function ProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [detectedTimezone, setDetectedTimezone] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setDetectedTimezone(getDetectedTimezone())
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      const response = await fetch('/api/onboarding/profile', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        // show inline validation errors when provided
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors)
        } else {
          toast.error(data.error || "Unable to save profile. Please try again.")
        }
        setIsLoading(false)
        return
      }

      toast.success("Profile saved.")
      router.push('/onboarding/check-in')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <PrimaryCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="username" className="text-gold-400 font-semibold block">
            Brotherhood Name *
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Choose your warrior name..."
            required
            className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
          />
          {errors.username && (
            <p className="text-sm text-red-400 mt-1">{errors.username}</p>
          )}
          <p className="text-sm text-gray-400">
            This will be your identity within the Brotherhood. Choose wisely.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-gold-400 font-semibold block">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="City, Country"
            className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
          />
          {errors.location && (
            <p className="text-sm text-red-400 mt-1">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="timezone" className="text-gold-400 font-semibold block">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={detectedTimezone}
            className="w-full bg-gray-800 border border-gray-600 text-white focus:border-gold-500 rounded-md px-3 py-2"
          >
            <option value="">Select your timezone</option>
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          {detectedTimezone && (
            <p className="text-xs text-gray-500">
              Detected: {timezones.find(tz => tz.value === detectedTimezone)?.label || detectedTimezone}
            </p>
          )}
          {errors.timezone && (
            <p className="text-sm text-red-400 mt-1">{errors.timezone}</p>
          )}
        </div>

        <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <input
            id="fatherhoodEnabled"
            name="fatherhoodEnabled"
            type="checkbox"
            value="true"
            className="mt-1 border border-gray-600 bg-gray-800 text-gold-500 focus:ring-gold-500 rounded"
          />
          <div>
            <label htmlFor="fatherhoodEnabled" className="text-gray-200 font-medium block">
              Enable Fatherhood Module
            </label>
            <p className="text-sm text-gray-400 mt-1">
              Track time with children, patience score, and fatherhood metrics to become a better father.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Claim Your Identity"
            )}
          </Button>
        </div>
      </form>
    </PrimaryCard>
  )
}
