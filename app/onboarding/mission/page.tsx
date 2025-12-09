import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Crest from '@/components/brand/Crest'
import SectionHeading from '@/components/brand/SectionHeading'
import PrimaryCard from '@/components/PrimaryCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MissionPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userId = session.user.id

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingComplete: true }
  })

  if (user?.onboardingComplete) {
    redirect('/command-center')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-12 bg-gold-500 rounded-full" />
          <div className="h-2 w-12 bg-white/20 rounded-full" />
          <div className="h-2 w-12 bg-white/20 rounded-full" />
          <div className="h-2 w-12 bg-white/20 rounded-full" />
        </div>
        <p className="text-center text-sm text-gray-400">Step 1 of 4: Mission</p>

        {/* Brotherhood Crest */}
        <div className="flex justify-center">
          <Crest className="w-20 h-20 text-gold-400" />
        </div>

        {/* Mission Statement */}
        <div className="text-center space-y-4">
          <SectionHeading className="text-3xl md:text-4xl">
            Our Sacred Mission
          </SectionHeading>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            In a world of distraction and weakness, we stand as beacons of masculine excellence.
            The Brotherhood exists to forge men of unbreakable character, unyielding discipline,
            and relentless pursuit of mastery.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 gap-6">
          <PrimaryCard>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Excellence Above All</h3>
              <p className="text-gray-300">
                We reject mediocrity. Every brother strives for mastery in his chosen path,
                whether it be physical dominance, financial independence, or mental supremacy.
                Good enough is never enough.
              </p>
            </div>
          </PrimaryCard>

          <PrimaryCard>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Brotherhood First</h3>
              <p className="text-gray-300">
                Strength comes from unity. We support each other in victory and defeat,
                sharing knowledge, resources, and accountability. One brother&apos;s success
                elevates us all.
              </p>
            </div>
          </PrimaryCard>

          <PrimaryCard>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Legacy Over Legacy</h3>
              <p className="text-gray-300">
                We build not for today, but for generations. Our wealth, our knowledge,
                our strength—all serve to create a lasting impact that outlives us.
              </p>
            </div>
          </PrimaryCard>

          <PrimaryCard>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gold-400">Discipline is Freedom</h3>
              <p className="text-gray-300">
                True freedom comes from self-mastery. We embrace the grind, the sacrifice,
                the delayed gratification that separates men from boys. Discipline today,
                freedom tomorrow.
              </p>
            </div>
          </PrimaryCard>
        </div>

        {/* The Oath */}
        <PrimaryCard className="border-gold-500/30">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gold-400">The Brotherhood Oath</h3>
            <div className="text-lg text-gray-200 font-medium space-y-2 max-w-2xl mx-auto">
              <p>&quot;I pledge my honor to the Brotherhood.</p>
              <p>I will pursue excellence in body, mind, and spirit.</p>
              <p>I will stand with my brothers through victory and defeat.</p>
              <p>I will build wealth that serves future generations.</p>
              <p>I will never settle for less than my best.&quot;</p>
            </div>
          </div>
        </PrimaryCard>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/onboarding/welcome">
            <Button variant="outline" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10">
              ← Back to Welcome
            </Button>
          </Link>

          <Link href="/onboarding/profile">
            <Button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold">
              Accept the Mission →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}