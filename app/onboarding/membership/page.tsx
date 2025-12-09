import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Crest from '@/components/brand/Crest'
import SectionHeading from '@/components/brand/SectionHeading'
import PrimaryCard from '@/components/PrimaryCard'
import { Button } from '@/components/ui/button'
import ActivateMembershipClient from './ActivateMembershipClient'
import Link from 'next/link'

export default async function MembershipPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userId = session.user.id

  // Check user status
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingComplete: true,
      username: true,
      location: true,
      timezone: true,
      fatherhoodEnabled: true
    }
  })

  if (user?.onboardingComplete) {
    redirect('/command-center')
  }

  // Check if user has completed profile and check-in
  const hasProfile = user?.username
  const hasCheckIn = await prisma.dailyLog.findFirst({
    where: { userId: userId }
  })

  if (!hasProfile || !hasCheckIn) {
    redirect('/onboarding/check-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
        </div>
        <p className="text-center text-sm text-gray-400">Step 4 of 4: Final Activation</p>

        {/* Brotherhood Crest */}
        <div className="flex justify-center">
          <Crest className="w-24 h-24 text-gold-400" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <SectionHeading className="text-4xl md:text-5xl">
            Welcome, Brother {user.username}
          </SectionHeading>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            You have proven your commitment. The path of mastery awaits.
            Your journey as a member of the Brotherhood begins now.
          </p>
        </div>

        {/* Membership Benefits */}
        <PrimaryCard className="text-left">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gold-400 mb-4">Your Brotherhood Privileges</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">📊 Command Center Access</h4>
                <p className="text-sm text-gray-400">Monitor your progress across all domains of mastery.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">👥 Clan System</h4>
                <p className="text-sm text-gray-400">Join elite brotherhoods and share the journey with like-minded men.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📈 Advanced Analytics</h4>
                <p className="text-sm text-gray-400">Deep insights into your fitness, wealth, and mental performance.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🏆 Prestige System</h4>
                <p className="text-sm text-gray-400">Earn ranks and recognition for your achievements.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">💼 Portfolio Tracking</h4>
                <p className="text-sm text-gray-400">Monitor and optimize your path to financial sovereignty.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📝 Daily Accountability</h4>
                <p className="text-sm text-gray-400">Structured check-ins to maintain discipline and momentum.</p>
              </div>
            </div>
          </div>
        </PrimaryCard>

        {/* Final Oath */}
        <PrimaryCard className="border-gold-500/30">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gold-400">The Final Oath</h3>
            <div className="text-lg text-gray-200 font-medium space-y-2">
              <p>&quot;I, {user.username}, do solemnly swear to uphold the values of the Brotherhood.</p>
              <p>I commit to relentless self-improvement and brotherhood with my fellow men.</p>
              <p>I will not falter in the face of adversity, nor settle for anything less than excellence.</p>
              <p>From this day forward, I am a Brother in the pursuit of mastery.&quot;</p>
            </div>
          </div>
        </PrimaryCard>

        {/* Activation Button */}
        <div className="space-y-4">
          <p className="text-lg text-gray-400">
            Ready to begin your transformation? Activate your membership now.
          </p>
          <ActivateMembershipClient />
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <Link href="/onboarding/check-in">
            <Button variant="outline" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10">
              ← Back to Check-in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}