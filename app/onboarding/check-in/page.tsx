import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Crest from '@/components/brand/Crest'
import SectionHeading from '@/components/brand/SectionHeading'
import PrimaryCard from '@/components/PrimaryCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CheckInPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userId = session.user.id

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingComplete: true, username: true }
  })

  if (user?.onboardingComplete) {
    redirect('/command-center')
  }

  if (!user?.username) {
    redirect('/onboarding/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-white/20 rounded-full" />
        </div>
        <p className="text-center text-sm text-gray-400">Step 3 of 4: First Check-in</p>

        {/* Brotherhood Crest */}
        <div className="flex justify-center">
          <Crest className="w-20 h-20 text-gold-400" />
        </div>

        {/* Check-in Setup */}
        <div className="text-center space-y-4">
          <SectionHeading className="text-3xl md:text-4xl">
            Your First Stand
          </SectionHeading>
          <p className="text-lg text-gray-300 font-light">
            Record your current state, Brother {user.username}. This establishes your baseline
            for the transformation ahead.
          </p>
        </div>

        {/* Check-in Form */}
        <PrimaryCard>
          <form action="/api/onboarding/check-in" method="POST" className="space-y-6">
            {/* Fitness Metrics */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Physical Condition</h3>

              <div className="space-y-2">
                <label className="text-gray-300 block">Current Weight (lbs)</label>
                <input
                  name="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your weight"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block">Bench Press Max (lbs)</label>
                <input
                  name="benchMax"
                  type="number"
                  placeholder="One rep max"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block">Squat Max (lbs)</label>
                <input
                  name="squatMax"
                  type="number"
                  placeholder="One rep max"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Financial Position</h3>

              <div className="space-y-2">
                <label className="text-gray-300 block">Total Savings ($)</label>
                <input
                  name="totalSavings"
                  type="number"
                  placeholder="Emergency fund + investments"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Mental State */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Mental Fortitude</h3>

              <div className="space-y-3">
                <label className="text-gray-300 block">Current Energy Level (1-10)</label>
                <div className="px-2">
                  <input
                    name="energyLevel"
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="7"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block">Today&apos;s Wins</label>
                <textarea
                  name="wins"
                  placeholder="What victories did you achieve today?"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block">Areas for Growth</label>
                <textarea
                  name="challenges"
                  placeholder="What challenges are you facing?"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3"
              >
                Submit First Report
              </Button>
            </div>
          </form>
        </PrimaryCard>

        {/* Navigation */}
        <div className="flex justify-center">
          <Link href="/onboarding/profile">
            <Button variant="outline" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10">
              ← Back to Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}