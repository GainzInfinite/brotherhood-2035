'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crest } from '@/components/brand'
import { Crown, Check, Shield, Zap, TrendingUp } from 'lucide-react'

export default function MembershipPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: Shield,
      title: 'Unlimited Access',
      description: 'Full access to all Brotherhood OS features forever',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights into your progress and growth metrics',
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Direct access to Brotherhood support and updates',
    },
    {
      icon: Crown,
      title: 'Elite Status',
      description: 'Join the ranks of the Brotherhood elite members',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-[#F5E6D3] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Crest */}
        <div className="flex justify-center mb-8">
          <Crest className="w-32 h-32" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gold-500">
            Join the Brotherhood
          </h1>
          <p className="text-xl text-[#F5E6D3]/70">
            Unlock your full potential with Elite Membership
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-[#1A1A1A] border border-gold-500/20 rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-6xl font-bold text-gold-500">$20.35</span>
              <span className="text-2xl text-[#F5E6D3]/60">/month</span>
            </div>
            <p className="text-[#F5E6D3]/70">
              Cancel anytime • Billed monthly
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5E6D3] mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[#F5E6D3]/60">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Crown className="w-5 h-5" />
                <span>Become a Member</span>
              </>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center mt-4">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-[#F5E6D3]/50">
          <p>Secure payment powered by Stripe</p>
          <p className="mt-2">
            By joining, you agree to the Brotherhood terms of service
          </p>
        </div>
      </div>
    </div>
  )
}
