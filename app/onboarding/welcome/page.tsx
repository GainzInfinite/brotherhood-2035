import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Crest from '@/components/brand/Crest'
import SectionHeading from '@/components/brand/SectionHeading'
import PrimaryCard from '@/components/PrimaryCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function WelcomePage() {
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
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Brotherhood Crest */}
        <div className="flex justify-center">
          <Crest className="w-24 h-24 text-gold-400" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <SectionHeading className="text-4xl md:text-5xl">
            Welcome to the Brotherhood
          </SectionHeading>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            A private society of elite men committed to mastery in fitness, wealth, and character.
            Join the ranks of those who refuse to settle for mediocrity.
          </p>
        </div>

        {/* Core Principles */}
        <PrimaryCard className="text-left">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gold-400 mb-4">Our Code</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">💪</div>
                <h4 className="font-semibold text-white mb-2">Physical Mastery</h4>
                <p className="text-sm text-gray-400">Forge an unbreakable body through discipline and strength.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold text-white mb-2">Financial Sovereignty</h4>
                <p className="text-sm text-gray-400">Build wealth that lasts generations, not fleeting riches.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-semibold text-white mb-2">Mental Fortitude</h4>
                <p className="text-sm text-gray-400">Cultivate unshakeable focus and unwavering resolve.</p>
              </div>
            </div>
          </div>
        </PrimaryCard>

        {/* Call to Action */}
        <div className="space-y-4">
          <p className="text-lg text-gray-400">
            Ready to begin your transformation? Your journey starts now.
          </p>
          <Link href="/onboarding/mission">
            <Button className="bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-black font-semibold px-8 py-3 text-lg transition-all duration-200 hover:scale-105 active:scale-95">
              Begin Initiation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}