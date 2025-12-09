import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import Crest from '@/components/brand/Crest'
import SectionHeading from '@/components/brand/SectionHeading'
import PrimaryCard from '@/components/PrimaryCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/onboarding/welcome')
  }

  // Check if user has completed onboarding
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { onboardingComplete: true }
  })

  if (userData?.onboardingComplete) {
    redirect('/command-center')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-white/20 rounded-full" />
          <div className="h-2 w-12 bg-white/20 rounded-full" />
        </div>
        <p className="text-center text-sm text-gray-400">Step 2 of 4: Profile Setup</p>

        {/* Brotherhood Crest */}
        <div className="flex justify-center">
          <Crest className="w-20 h-20 text-gold-400" />
        </div>

        {/* Profile Setup */}
        <div className="text-center space-y-4">
          <SectionHeading className="text-3xl md:text-4xl">
            Establish Your Identity
          </SectionHeading>
          <p className="text-lg text-gray-300 font-light">
            Choose your brotherhood name and set your foundation for the journey ahead.
          </p>
        </div>

        <ProfileForm />

        {/* Navigation */}
        <div className="flex justify-center">
          <Link href="/onboarding/mission">
            <Button variant="outline" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10">
              ← Back to Mission
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}