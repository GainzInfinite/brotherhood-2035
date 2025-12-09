"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-hot-toast"
import { Loader2, Save, Globe, Scale, Coins, Clock } from "lucide-react"

interface SettingsFormProps {
  initialSettings: {
    enableFatherhoodModule: boolean
    currency: string
    weightUnit: string
    volumeUnit: string
  }
  initialTimezone: string | null
}

export default function SettingsForm({ initialSettings, initialTimezone }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)
  const [timezone, setTimezone] = useState(initialTimezone || "UTC")

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          timezone,
        }),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Global Preferences */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            Default Currency
          </Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AUD">AUD ($)</option>
            <option value="CAD">CAD ($)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="BTC">Bitcoin (₿)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Timezone
          </Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="America/Chicago">Central Time (US & Canada)</option>
            <option value="America/Denver">Mountain Time (US & Canada)</option>
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Australia/Sydney">Sydney</option>
            {/* Add more as needed */}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Weight Unit
          </Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={settings.weightUnit}
            onChange={(e) => setSettings({ ...settings, weightUnit: e.target.value })}
          >
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Volume Unit
          </Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={settings.volumeUnit}
            onChange={(e) => setSettings({ ...settings, volumeUnit: e.target.value })}
          >
            <option value="liters">Liters (L)</option>
            <option value="oz">Fluid Ounces (fl oz)</option>
          </select>
        </div>
      </div>

      {/* Module Settings */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-lg font-cinzel mb-4">Modules</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fatherhood" 
            checked={settings.enableFatherhoodModule}
            onCheckedChange={(checked) => 
              setSettings({ ...settings, enableFatherhoodModule: checked as boolean })
            }
          />
          <Label htmlFor="fatherhood" className="font-medium cursor-pointer">
            Enable Fatherhood Module
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-2 ml-6">
          Unlocks the Fatherhood dashboard for tracking patience, time spent, and family legacy.
        </p>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-[120px]">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
