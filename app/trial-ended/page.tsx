"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Crest from "@/components/brand/Crest"
import SectionHeading from "@/components/brand/SectionHeading"
import PrimaryCard from "@/components/PrimaryCard"
import { Button } from "@/components/ui/button"
import { Trophy, Target, TrendingUp, DollarSign, BookOpen } from "lucide-react"

interface TrialStats {
  level: number
  xp: number
  checkIns: number
  consistencyScore: number
  incomeLogsCount: number
  journalCount: number
}

export default function TrialEndedPage() {
  const router = useRouter()
  const [stats, setStats] = useState<TrialStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/trial-stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch trial stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        {/* Brotherhood Crest */}
        <div className="flex justify-center">
          <Crest className="w-24 h-24 text-gold-400 animate-pulse" />
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <SectionHeading className="text-4xl md:text-5xl text-gold-400">
            Brother… Your Trial Has Ended
          </SectionHeading>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            Your 14-day journey in the Brotherhood has shown what&apos;s possible.
            <br />
            Now it&apos;s time to unlock the full power of Brotherhood OS.
          </p>
        </div>

        {/* Progress Summary */}
        {!loading && stats && (
          <PrimaryCard>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gold-400 mb-6">Your Journey So Far</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Level & XP</p>
                    <p className="font-numeric text-xl font-semibold text-foreground">
                      Level {stats.level} • {stats.xp} XP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Check-ins</p>
                    <p className="font-numeric text-xl font-semibold text-foreground">
                      {stats.checkIns} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Consistency Score</p>
                    <p className="font-numeric text-xl font-semibold text-foreground">
                      {stats.consistencyScore}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Income Logs</p>
                    <p className="font-numeric text-xl font-semibold text-foreground">
                      {stats.incomeLogsCount} entries
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Journal Entries</p>
                    <p className="font-numeric text-xl font-semibold text-foreground">
                      {stats.journalCount} entries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PrimaryCard>
        )}

        {/* Membership Value Proposition */}
        <PrimaryCard className="border-gold-500/30">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gold-400">Continue Your Ascension</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Unlimited Access</h4>
                <p className="text-sm text-gray-400">All modules, features, and future updates</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Advanced Analytics</h4>
                <p className="text-sm text-gray-400">Deep insights into your progress</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Clan System</h4>
                <p className="text-sm text-gray-400">Join elite brotherhoods worldwide</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Prestige Ranks</h4>
                <p className="text-sm text-gray-400">Ascend through the hierarchy</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Priority Support</h4>
                <p className="text-sm text-gray-400">Direct access to the dev team</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Future Beta Access</h4>
                <p className="text-sm text-gray-400">Be first to test new features</p>
              </div>
            </div>
          </div>
        </PrimaryCard>

        {/* CTA */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gold-400 font-mono">
              $20.35<span className="text-base text-gray-400">/month</span>
            </p>
            <p className="text-sm text-gray-400">
              One symbolic price. Unlimited transformation.
            </p>
          </div>
          <Button
            onClick={() => router.push('/membership')}
            className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-6 text-lg"
          >
            Join the Brotherhood
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500">
          Your progress is saved. Activate membership to continue your journey.
        </p>
      </div>
    </div>
  )
}
