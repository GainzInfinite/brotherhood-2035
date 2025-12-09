"use client"

import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Button } from "@/components/Button"
import { User, TrendingUp, Award, Target, Calendar, Crown, Users, Zap, Star } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getPrestigeInfo } from "@/lib/prestige"
import PrestigeEmblem from "@/components/brand/PrestigeEmblem"
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [consistencyScore, setConsistencyScore] = useState(0)
  const [sevenDayAvg, setSevenDayAvg] = useState(0)
  const [userClan, setUserClan] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [showPrestigeModal, setShowPrestigeModal] = useState(false)
  const [prestigeLoading, setPrestigeLoading] = useState(false)

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch consistency data
        const consistencyResponse = await fetch('/api/daily-log')
        const consistencyResult = await consistencyResponse.json()
        if (consistencyResult.success && consistencyResult.data?.consistencyScore) {
          setConsistencyScore(consistencyResult.data.consistencyScore)
          setSevenDayAvg(78) // Mock 7-day average
        }

        // Fetch clan membership
        const clanResponse = await fetch('/api/clans')
        const clanResult = await clanResponse.json()
        if (clanResult.success) {
          setUserClan(clanResult.userClan)
        }

        // Fetch user prestige data
        const prestigeResponse = await fetch('/api/prestige')
        const prestigeResult = await prestigeResponse.json()
        if (prestigeResult.success) {
          setUserData(prestigeResult)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handlePrestige = async () => {
    setPrestigeLoading(true)
    try {
      const response = await fetch('/api/prestige', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        setUserData((prev: any) => prev ? { ...prev, user: result.user, canPrestige: false } : null)
        setShowPrestigeModal(false)
      } else {
        toast.error(result.error || 'Failed to prestige')
      }
    } catch (error) {
      console.error('Error prestiging:', error)
      toast.error('Failed to prestige')
    } finally {
      setPrestigeLoading(false)
    }
  }

  const prestigeInfo = userData?.user ? getPrestigeInfo(userData.user.prestigeRank) : getPrestigeInfo(0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Your Brotherhood identity and stats
        </p>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 rounded-lg border border-border bg-card">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">Elite Member</h2>
          <p className="text-muted-foreground">
            Level {userData?.user?.level || 1} • {userData?.user?.xp || 0} XP
            {userData?.user?.prestigeRank > 0 && (
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${prestigeInfo.bgColor} ${prestigeInfo.color}`}>
                {prestigeInfo.name} Prestige
              </span>
            )}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">7 Achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Member since 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Daily Consistency Score">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Today&apos;s Score</span>
              <span className="font-numeric text-xl font-semibold text-foreground">{consistencyScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">7-Day Average</span>
              <span className="font-numeric text-lg font-semibold text-primary">{sevenDayAvg}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="font-numeric text-lg font-semibold text-primary">95%</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Weekly Progress</span>
                <span className="font-numeric text-sm text-primary">{sevenDayAvg}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${sevenDayAvg}%` }} />
              </div>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Personal Info">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium text-foreground">John Doe</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm font-medium text-foreground">New York, NY</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="text-sm font-medium text-foreground">Jan 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Time Zone</span>
              <span className="text-sm font-medium text-foreground">EST</span>
            </div>
          </div>
        </PrimaryCard>

        {userClan ? (
          <PrimaryCard title={
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Clan Membership
            </div>
          }>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Clan Name</span>
                <span className="text-sm font-medium text-primary">{userClan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your Role</span>
                <span className="text-sm font-medium text-foreground">{userClan.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">Recent</span>
              </div>
              <Link href={`/clans/${userClan.slug}`}>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  Open Clan
                </button>
              </Link>
            </div>
          </PrimaryCard>
        ) : (
          <PrimaryCard title={
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clan Status
            </div>
          }>
            <div className="space-y-4">
              <div className="text-center py-4">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">Not a member of any clan</p>
                <Link href="/clans">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Find a Clan
                  </button>
                </Link>
              </div>
            </div>
          </PrimaryCard>
        )}

        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Prestige Status
          </div>
        }>
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-3">
                <PrestigeEmblem rank={userData?.user?.prestigeRank || 0} size="lg" showLabel={false} />
              </div>
              <h3 className={`text-lg font-bold ${prestigeInfo.color}`}>
                {prestigeInfo.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Rank {userData?.user?.prestigeRank || 0}
              </p>
            </div>

            {userData?.canPrestige ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-primary font-medium text-center">
                    Ready to Ascend!
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {userData.prestigeMessage}
                  </p>
                </div>
                <Button
                  onClick={() => setShowPrestigeModal(true)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                >
                  Ascend to Prestige Rank {userData.nextRank}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {userData?.prestigeMessage || 'Keep progressing to unlock prestige'}
                </p>
              </div>
            )}

            {userData?.user?.prestigeDate && (
              <div className="text-center pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Last ascended: {new Date(userData.user.prestigeDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </PrimaryCard>

        <PrimaryCard title="Stats Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Check-Ins</span>
              <span className="font-numeric text-lg font-semibold text-foreground">247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Streak</span>
              <span className="font-numeric text-lg font-semibold text-primary">14 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Challenges Won</span>
              <span className="font-numeric text-lg font-semibold text-primary">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Achievements</span>
              <span className="font-numeric text-lg font-semibold text-foreground">7</span>
            </div>
          </div>
        </PrimaryCard>
      </div>

      {/* Additional Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecondaryCard title="Recent Achievements">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Consistency Master</p>
                <p className="text-xs text-muted-foreground">7-day streak achieved</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Goal Crusher</p>
                <p className="text-xs text-muted-foreground">Completed 50 daily goals</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Progress Pioneer</p>
                <p className="text-xs text-muted-foreground">30-day improvement streak</p>
              </div>
            </div>
          </div>
        </SecondaryCard>

        <SecondaryCard title="Settings & Preferences">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Fatherhood Module</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Email Notifications</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Disabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Data Export</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Available</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Edit Profile Settings
            </button>
          </div>
        </SecondaryCard>
      </div>

      {/* Prestige Modal */}
      {showPrestigeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ascend to Prestige</h3>
              <p className="text-muted-foreground text-sm">
                Prestiging resets your XP and Level, but grants a permanent Prestige Rank.
                This represents mastery, discipline, and rebirth into a stronger version of yourself.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p className="font-numeric text-lg font-semibold text-foreground">
                    Level {userData?.user?.level} • {userData?.user?.xp} XP
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-center">
                  <p className="text-sm text-yellow-600">After Prestige</p>
                  <p className="font-numeric text-lg font-semibold text-yellow-600">
                    Level 1 • 0 XP • {prestigeInfo.name} Rank {userData?.nextRank}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPrestigeModal(false)}
                className="flex-1"
                disabled={prestigeLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePrestige}
                disabled={prestigeLoading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              >
                {prestigeLoading ? 'Ascending...' : 'Confirm Ascension'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
