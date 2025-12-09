"use client"

import { Crown, LogOut } from "lucide-react"
import Crest from "@/components/brand/Crest"
import PrestigeEmblem from "@/components/brand/PrestigeEmblem"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TrialInfo {
  isActive: boolean
  daysLeft: number
  isMember: boolean
}

export default function HeaderBar() {
  const router = useRouter()
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null)

  useEffect(() => {
    // Fetch user's onboarding status
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setOnboardingComplete(data.user.onboardingComplete || false)
        }
      })
      .catch(err => console.error('Error fetching user:', err))

    // Fetch trial status
    fetch('/api/trial-info')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTrialInfo(data.trial)
        }
      })
      .catch(err => console.error('Error fetching trial info:', err))
  }, [])

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-background/80 px-8 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        {/* Mobile only crest, hidden on desktop as it's in sidebar */}
        <div className="md:hidden">
            <Crest size="sm" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-widest font-heading uppercase hidden md:block">
          Command Center
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Elite Member Badge - Show if user is a member */}
        {trialInfo && trialInfo.isMember && (
          <div 
            className="flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 transition-all duration-300 hover:scale-105"
          >
            <Crown className="h-4 w-4 text-gold-400" />
            <div className="text-sm">
              <div className="font-bold text-gold-400 tracking-wide text-xs">
                Elite Member
              </div>
            </div>
          </div>
        )}

        {/* Trial Badge - Only show if trial active and not a member */}
        {trialInfo && trialInfo.isActive && !trialInfo.isMember && (
          <div 
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 transition-all duration-300 cursor-pointer hover:scale-105 ${
              trialInfo.daysLeft <= 2 
                ? 'border-gold-500/40 bg-gold-500/10 animate-pulse' 
                : 'border-gold-500/20 bg-gold-500/5'
            }`}
            onClick={() => router.push('/membership')}
          >
            <Crown className="h-4 w-4 text-gold-400" />
            <div className="text-sm">
              <div className="font-bold text-gold-400 tracking-wide text-xs">
                Trial: {trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? 'day' : 'days'} left
              </div>
            </div>
          </div>
        )}

        {/* Prestige Status - Only show if onboarding complete */}
        {onboardingComplete && (
          <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 transition-all duration-300 hover:bg-primary/10 hover:border-primary/40 group">
            <PrestigeEmblem rank={5} size="sm" showLabel={false} />
            <div className="text-sm">
              <div className="font-bold text-primary tracking-wide uppercase text-xs group-hover:text-primary/80 transition-colors">Elite Member</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Prestige Level 5</div>
            </div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/landing' })}
              className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
