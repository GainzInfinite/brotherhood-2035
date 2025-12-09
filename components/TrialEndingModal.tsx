"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Crown } from "lucide-react"
import Crest from "@/components/brand/Crest"

export default function TrialEndingModal() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Never show modal on trial-ended page or membership page
    if (pathname === '/trial-ended' || pathname === '/membership') {
      return
    }

    // Check if modal was already dismissed in this session
    const wasDismissed = sessionStorage.getItem('trialEndingModalDismissed')
    if (wasDismissed) {
      setDismissed(true)
      return
    }

    // Fetch trial info
    const checkTrialStatus = async () => {
      try {
        const response = await fetch('/api/trial-info')
        const data = await response.json()
        
        if (data.success && data.trial) {
          // Never show modal if user is already a member
          if (data.trial.isMember) {
            return
          }
          
          // Show modal ONLY on Day 13 (1 day left, trial still active)
          // Do NOT show if trial expired (daysLeft === 0)
          if (data.trial.isActive && data.trial.daysLeft === 1) {
            setIsOpen(true)
          }
        }
      } catch (error) {
        console.error('Failed to check trial status:', error)
      }
    }

    checkTrialStatus()
  }, [pathname])

  const handleDismiss = () => {
    setIsOpen(false)
    setDismissed(true)
    sessionStorage.setItem('trialEndingModalDismissed', 'true')
  }

  const handleJoinBrotherhood = () => {
    setIsOpen(false)
    router.push('/membership')
  }

  if (dismissed) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] border-gold-500/30">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Crest className="w-16 h-16 text-gold-400 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl text-center text-gold-400 font-heading">
            Brother… Your Trial Ends Tomorrow
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300 text-base space-y-4 pt-4">
            <div className="flex items-center justify-center gap-2 text-gold-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Don&apos;t lose your progress</span>
            </div>
            <p className="text-sm text-gray-400">
              Your journey in the Brotherhood has just begun. Continue building your legacy with full access to all modules, analytics, and the elite community.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleJoinBrotherhood}
            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-6 text-base"
          >
            <Crown className="h-5 w-5 mr-2" />
            Join the Brotherhood — $20.35/month
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="w-full border-gold-500/30 text-gold-400 hover:bg-gold-500/10"
          >
            Continue Trial
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Your progress is automatically saved. No credit card required for trial.
        </p>
      </DialogContent>
    </Dialog>
  )
}
