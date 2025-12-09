import Link from 'next/link'
import { Crest } from '@/components/brand'
import { Crown, ArrowRight } from 'lucide-react'

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-[#F5E6D3] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Crest */}
        <div className="flex justify-center mb-8">
          <Crest className="w-32 h-32 animate-pulse" />
        </div>

        {/* Success Message */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-12 h-12 text-gold-500" />
            <h1 className="text-5xl font-bold text-gold-500">
              Welcome, Brother
            </h1>
          </div>
          <p className="text-xl text-[#F5E6D3]/70 mb-4">
            Your membership is now active
          </p>
          <p className="text-[#F5E6D3]/60">
            You now have unlimited access to all Brotherhood OS features.
            <br />
            Your journey to excellence continues.
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-[#1A1A1A] border border-gold-500/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#F5E6D3]">
            What&apos;s Next?
          </h2>
          <ul className="space-y-3 text-left mb-6">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gold-500 text-sm">✓</span>
              </div>
              <span className="text-[#F5E6D3]/80">
                Full access to Health, Wealth, Mind, and Fatherhood modules
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gold-500 text-sm">✓</span>
              </div>
              <span className="text-[#F5E6D3]/80">
                Advanced analytics and progress tracking
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gold-500 text-sm">✓</span>
              </div>
              <span className="text-[#F5E6D3]/80">
                Priority support and feature updates
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gold-500 text-sm">✓</span>
              </div>
              <span className="text-[#F5E6D3]/80">
                Elite Member badge and status
              </span>
            </li>
          </ul>

          {/* CTA Button */}
          <Link
            href="/command-center"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 px-8 rounded-lg transition-all"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-[#F5E6D3]/50">
          A confirmation email has been sent to your registered email address
        </p>
      </div>
    </div>
  )
}
