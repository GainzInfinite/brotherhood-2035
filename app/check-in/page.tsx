"use client"

import { useState, useEffect, ChangeEvent } from "react"
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { Activity, Save, CheckCircle2, SkipForward } from "lucide-react"
import { Prisma } from "@prisma/client"

type DailyLogInput = {
  weight: number | null;
  pushups: number | null;
  steps: number | null;
  waterIntake: number | null;
  bikeMinutes: number | null;
  weightTraining: boolean;
  stretching: boolean;
  isSkipped: boolean;
};

type UserSettings = {
  weightUnit: string;
  volumeUnit: string;
};

// Calculate consistency score based on logged data
const calculateConsistencyScore = (formData: DailyLogInput): number => {
  let pointsEarned = 0
  const totalPointsPossible = 7;

  if (Number(formData.weight) > 0) pointsEarned++;
  if (Number(formData.pushups) > 0) pointsEarned++;
  if (Number(formData.steps) > 0) pointsEarned++;
  if (Number(formData.waterIntake) > 0) pointsEarned++;
  if (Number(formData.bikeMinutes) > 0) pointsEarned++;
  if (formData.weightTraining) pointsEarned++;
  if (formData.stretching) pointsEarned++;

  return Math.round((pointsEarned / totalPointsPossible) * 100);
}

export default function CheckInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    weightUnit: 'lbs',
    volumeUnit: 'oz'
  })
  
  const [formData, setFormData] = useState<DailyLogInput>({
    weight: null,
    pushups: null,
    steps: null,
    waterIntake: null,
    bikeMinutes: null,
    weightTraining: false,
    stretching: false,
    isSkipped: false,
  })
  
  // Load user settings and today's data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch user settings
        const settingsResponse = await fetch('/api/settings');
        if (settingsResponse.ok) {
          const settingsResult = await settingsResponse.json();
          if (settingsResult.success) {
            setSettings({
              weightUnit: settingsResult.data.weightUnit || 'lbs',
              volumeUnit: settingsResult.data.volumeUnit || 'oz'
            });
          }
        }

        // Fetch today's log data
        const logResponse = await fetch('/api/daily-log');
        const logResult = await logResponse.json();
        
        if (logResult.success && logResult.data) {
          const { consistencyScore, ...logData } = logResult.data;
          // Only keep relevant fields
          setFormData({
            weight: logData.weight,
            pushups: logData.pushups,
            steps: logData.steps,
            waterIntake: logData.waterIntake,
            bikeMinutes: logData.bikeMinutes,
            weightTraining: logData.weightTraining,
            stretching: logData.stretching || false,
            isSkipped: logData.isSkipped || false,
          });
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    }
    
    loadInitialData();
  }, [])
  
  const handleInputChange = (field: keyof DailyLogInput, value: string | boolean | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleNumericChange = (field: keyof DailyLogInput, value: string) => {
    handleInputChange(field, value === '' ? null : parseFloat(value));
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveCheckIn(false)
  }

  const handleSkip = async () => {
    if (!confirm("Are you sure you want to skip today's check-in? This will mark today as skipped.")) return
    await saveCheckIn(true)
  }

  const saveCheckIn = async (skipped: boolean) => {
    setIsLoading(true)
    
    try {
      const consistencyScore = skipped ? 0 : calculateConsistencyScore(formData);
      
      const response = await fetch('/api/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isSkipped: skipped,
          consistencyScore,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(skipped ? 'Check-In Skipped' : 'Check-In Saved ✓')
        setIsSaved(true)
        if (skipped) {
            setFormData(prev => ({ ...prev, isSkipped: true }))
        }
      } else {
        toast.error(result.error || 'Failed to save check-in')
      }
    } catch (error) {
      console.error('Error saving check-in:', error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground font-heading tracking-tight">Daily Check-In</h1>
          <p className="mt-2 text-muted-foreground font-body font-medium">
            {today}
          </p>
        </div>
        <div className="flex items-center">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[180px]"
        >
          {isLoading ? 'Saving...' : (isSaved ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Update Check-In
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Check-In
            </>
          ))}
        </Button>
        <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            disabled={isLoading}
            className="ml-2 text-muted-foreground hover:text-foreground"
        >
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
        </Button>
      </div>
    </div>
      
      {/* Status Indicator */}
      {isSaved && (
        <SecondaryCard>
          <div className="flex items-center gap-3 text-primary">
            {formData.isSkipped ? (
                <>
                    <SkipForward className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">You have skipped today&apos;s check-in.</span>
                </>
            ) : (
                <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Today&apos;s check-in is saved. You can update it anytime.</span>
                </>
            )}
          </div>
        </SecondaryCard>
      )}
      
      {/* Daily Log Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground font-heading">Daily Metrics</h2>
        </div>
        
        <PrimaryCard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({settings.weightUnit})</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumericChange('weight', e.target.value)}
                placeholder="185"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pushups">Pushups Today</Label>
              <Input
                id="pushups"
                type="number"
                value={formData.pushups ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumericChange('pushups', e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="steps">Steps Today</Label>
              <Input
                id="steps"
                type="number"
                value={formData.steps ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumericChange('steps', e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waterIntake">Water Drank ({settings.volumeUnit})</Label>
              <Input
                id="waterIntake"
                type="number"
                step="0.1"
                value={formData.waterIntake ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumericChange('waterIntake', e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bikeMinutes">Stationary Bike (min)</Label>
              <Input
                id="bikeMinutes"
                type="number"
                value={formData.bikeMinutes ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumericChange('bikeMinutes', e.target.value)}
                placeholder="0"
              />
            </div>
            
            {/* Empty div for grid alignment if needed, or just let it flow */}
            <div className="hidden lg:block"></div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weightTraining"
                  checked={formData.weightTraining ?? false}
                  onCheckedChange={(checked: boolean) => handleInputChange('weightTraining', checked)}
                />
                <label htmlFor="weightTraining" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Weight Training?
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stretching"
                  checked={formData.stretching ?? false}
                  onCheckedChange={(checked: boolean) => handleInputChange('stretching', checked)}
                />
                <label htmlFor="stretching" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Stretching?
                </label>
              </div>
            </div>
          </div>
        </PrimaryCard>
      </div>
      
      {/* Submit Button (Mobile) */}
      <div className="flex justify-center md:hidden">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : (isSaved ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Update Check-In
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Check-In
            </>
          ))}
        </Button>
      </div>
    </form>
  )
}
