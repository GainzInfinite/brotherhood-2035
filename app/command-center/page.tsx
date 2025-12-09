"use client"

import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { TrendingUp, Zap, Activity, Scale, Trophy, Target, Users, Crown, Star, DollarSign, PieChart, Plus, Heart, Brain } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getPrestigeInfo } from "@/lib/prestige"
import PrestigeEmblem from "@/components/brand/PrestigeEmblem"
import OnboardingWelcomePopup from "@/components/OnboardingWelcomePopup"
import { motion } from "framer-motion"

export default function CommandCenterPage() {
  const [consistencyScore, setConsistencyScore] = useState(0)
  const [userClan, setUserClan] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [dailyLog, setDailyLog] = useState<any>(null)
  const [latestIncome, setLatestIncome] = useState<any>(null)
  const [latestExpense, setLatestExpense] = useState<any>(null)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const router = useRouter()

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyResponse = await fetch('/api/daily-log', { cache: 'no-store' })
        const dailyResult = await dailyResponse.json()
        if (dailyResult.success && dailyResult.data) {
          setDailyLog(dailyResult.data)
          if (dailyResult.data.consistencyScore) setConsistencyScore(dailyResult.data.consistencyScore)
        }

        const clanResponse = await fetch('/api/clans', { cache: 'no-store' })
        const clanResult = await clanResponse.json()
        if (clanResult.success) {
          setUserClan(clanResult.userClan)
        }

        const prestigeResponse = await fetch('/api/prestige', { cache: 'no-store' })
        const prestigeResult = await prestigeResponse.json()
        if (prestigeResult.success) {
          setUserData(prestigeResult)
        }

        const portfolioResponse = await fetch('/api/portfolio', { cache: 'no-store' })
        const portfolioResult = await portfolioResponse.json()
        if (portfolioResult.success) {
          setPortfolioData(portfolioResult.summary)
        }

        // Fetch recent income logs and take the most recent
        const incomeResponse = await fetch('/api/income', { cache: 'no-store' })
        const incomeResult = await incomeResponse.json()
        if (incomeResult.success && Array.isArray(incomeResult.data) && incomeResult.data.length > 0) {
          setLatestIncome(incomeResult.data[0])
        }

        // Fetch latest expense (if API available)
        try {
          const expenseRes = await fetch('/api/expenses/latest', { cache: 'no-store' })
          const expenseData = await expenseRes.json()
          if (expenseData.success && expenseData.latest) {
            setLatestExpense(expenseData.latest)
          }
        } catch {}

        // Check if user has completed onboarding and show welcome popup
        const userResponse = await fetch('/api/user', { cache: 'no-store' })
        const userResult = await userResponse.json()
        if (userResult.success && userResult.user?.onboardingComplete && !userResult.user?.welcomePopupShown) {
          setShowWelcomePopup(true)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  // Optional: refresh clan state after creation/join without reload
  useEffect(() => {
    const handler = async () => {
      try {
        const clanResponse = await fetch('/api/clans', { cache: 'no-store' })
        const clanResult = await clanResponse.json()
        if (clanResult.success) {
          setUserClan(clanResult.userClan)
        }
      } catch (e) {
        console.error('Clan refresh failed', e)
      }
    }
    window.addEventListener('clan:updated', handler)
    return () => window.removeEventListener('clan:updated', handler)
  }, [])

  const prestigeInfo = userData ? getPrestigeInfo(userData.currentPrestige) : null

  const handleWelcomePopupClose = async () => {
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welcomePopupShown: true })
      })
      setShowWelcomePopup(false)
    } catch (error) {
      console.error('Error updating welcome popup status:', error)
    }
  }

  const metrics = [
    {
      label: "Consistency",
      value: consistencyScore > 0 ? `${consistencyScore}%` : "—",
      icon: TrendingUp,
      trend:
        consistencyScore >= 80
          ? "Excellent"
          : consistencyScore >= 60
          ? "Good"
          : "Needs work",
    },
    {
      label: "XP / Level",
      value: userData?.xp ? `${userData.xp} XP` : "—",
      icon: Zap,
      trend: userData?.level ? `Level ${userData.level}` : "No data yet",
    },
    {
      label: "Pushups Today",
      value: dailyLog?.pushups ?? "—",
      icon: Activity,
      trend: dailyLog?.pushups ? "Logged" : "No log",
    },
    {
      label: "Weight",
      value: dailyLog?.weight ? `${dailyLog.weight}` : "—",
      icon: Scale,
      trend: dailyLog?.weight ? "Logged" : "No log",
    },
    {
      label: "Prestige Rank",
      value: prestigeInfo?.name || "—",
      icon: Crown,
      trend: prestigeInfo?.name || "Complete onboarding",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Bar - Summary Metrics */}
      <div className="rounded-lg border border-border bg-card/95 p-4 sm:p-6 backdrop-blur">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <motion.p 
                    key={metric.value}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-numeric text-2xl font-bold text-foreground"
                  >
                    {metric.value}
                  </motion.p>
                  <p className="text-xs text-primary">{metric.trend}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Page Header */}
      <div className="mt-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Command Center</h1>
        <p className="mt-2 text-muted-foreground font-medium">
          Your strategic dashboard for total life optimization
        </p>
      </div>

      {/* Primary Modules Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Consistency Score">
          <div className="space-y-4">
            {consistencyScore > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Today&apos;s Score</span>
                  <span className="font-numeric text-xl font-semibold text-foreground">{consistencyScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">7-Day Average</span>
                  <span className="font-numeric text-lg font-semibold text-primary">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best Streak</span>
                  <span className="font-numeric text-lg font-semibold text-primary">—</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-foreground">Progress</span>
                    <span className="font-numeric text-sm text-primary">{consistencyScore}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${consistencyScore}%` }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No consistency data yet</p>
                <p className="text-xs text-muted-foreground mt-1">Complete daily check-ins to track progress</p>
              </div>
            )}
          </div>
        </PrimaryCard>

        <PrimaryCard title="Health Overview">
          <div className="space-y-4">
            {dailyLog ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Steps</p>
                  <p className="font-numeric text-lg font-semibold text-foreground">{dailyLog.steps ?? '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Water (L)</p>
                  <p className="font-numeric text-lg font-semibold text-foreground">{dailyLog.waterIntake ?? '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Meditation (min)</p>
                  <p className="font-numeric text-lg font-semibold text-foreground">{dailyLog.meditationMinutes ?? '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Study (min)</p>
                  <p className="font-numeric text-lg font-semibold text-foreground">{dailyLog.studyMinutes ?? '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Reading (min)</p>
                  <p className="font-numeric text-lg font-semibold text-foreground">{dailyLog.readingMinutes ?? '—'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No health data yet</p>
                <p className="text-xs text-muted-foreground mt-1">Complete daily check-ins to track progress</p>
              </div>
            )}
          </div>
        </PrimaryCard>
        
        <PrimaryCard title="Wealth Overview">
          <div className="space-y-4">
            {(latestIncome || latestExpense) ? (
              <div className="py-4 space-y-4">
                {latestIncome && (
                  <div>
                    <p className="text-sm text-muted-foreground">Latest income:</p>
                    <p className="font-mono text-lg font-semibold text-foreground mt-1">
                      {(() => {
                        const locale = (latestIncome?.userSettings?.locale) || 'en-US'
                        const currency = (latestIncome?.userSettings?.currency) || 'USD'
                        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(latestIncome.amount)
                      })()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(latestIncome.receivedDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Latest expense:</p>
                  {latestExpense ? (
                    <div className="text-foreground text-sm mt-1">
                      <span className="font-mono font-semibold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestExpense.amount)}
                      </span>
                      {latestExpense.category && (
                        <span className="ml-2 text-muted-foreground">{latestExpense.category}</span>
                      )}
                      {latestExpense.expenseDate && (
                        <p className="text-xs text-muted-foreground mt-1">{new Date(latestExpense.expenseDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground/70 text-sm mt-1">No expenses logged yet</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No wealth data yet</p>
                <p className="text-xs text-muted-foreground mt-1">Log income or expenses to start tracking</p>
              </div>
            )}
          </div>
        </PrimaryCard>
        
        <PrimaryCard title="Mind Overview">
          <div className="space-y-4">
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No mind data yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start journaling and meditating</p>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Prestige Status
          </div>
        }>
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <PrestigeEmblem rank={userData?.currentPrestige || 0} size="lg" showLabel={false} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Rank</span>
              <span className="text-sm font-medium text-primary">{prestigeInfo?.name || 'None'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Title</span>
              <span className="text-sm font-medium text-foreground">{prestigeInfo?.name || 'Initiate'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ascensions</span>
              <span className="font-numeric text-lg font-semibold text-primary">{userData?.currentPrestige || 0}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Next Ascension</span>
                <span className="font-numeric text-sm text-primary">{userData?.level || 0}/50</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${((userData?.level || 0) / 50) * 100}%` }} />
              </div>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Portfolio Overview
          </div>
        }>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="font-numeric text-lg font-semibold text-foreground">
                ${portfolioData?.totalValue?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Assets</span>
              <span className="font-numeric text-lg font-semibold text-primary">{portfolioData?.totalAssets || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Largest Holding</span>
              <span className="text-sm font-medium text-foreground">Bitcoin</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href="/wealth/portfolio" className="flex-1">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <PieChart className="h-4 w-4" />
                  View Portfolio
                </button>
              </Link>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => router.push("/wealth/income/new")}
                  className="w-full px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Log Income
                </button>
                <button 
                  onClick={() => router.push("/wealth/expense/new")}
                  className="w-full px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Log Expense
                </button>
              </div>
            </div>
          </div>
        </PrimaryCard>

        {userClan ? (
          <PrimaryCard title={
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Clan Status
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
                <span className="text-sm text-muted-foreground">Clan Activity</span>
                <span className="font-numeric text-lg font-semibold text-primary">Active</span>
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
                <p className="text-sm text-muted-foreground mb-4">Not in a clan yet</p>
                <Link href="/clans">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Find a Clan
                  </button>
                </Link>
              </div>
            </div>
          </PrimaryCard>
        )}
      </div>

      {/* Secondary Info Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecondaryCard title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-start gap-3 border-b border-border/50 pb-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Completed Morning Workout</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-b border-border/50 pb-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Logged daily check-in</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-muted mt-1.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Updated wealth metrics</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>
        </SecondaryCard>
        
        <SecondaryCard title="Daily Progress">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Daily Goals</span>
                <span className="font-numeric text-sm text-primary">6/8</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Weekly Streak</span>
                <span className="font-numeric text-sm text-primary">5/7</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-[71%] rounded-full bg-primary" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Challenge Progress</span>
                <span className="font-numeric text-sm text-primary">45%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-[45%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </SecondaryCard>
      </div>

      <OnboardingWelcomePopup 
        isOpen={showWelcomePopup} 
        onClose={handleWelcomePopupClose} 
      />
    </div>
  )
}
