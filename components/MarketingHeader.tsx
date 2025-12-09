"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import Crest from "@/components/brand/Crest"
import { Button } from "@/components/Button"

export default function MarketingHeader() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <Crest size="sm" />
            <span className="text-xl font-bold text-gold-500 tracking-wider font-cinzel hidden sm:block group-hover:text-gold-400 transition-colors">
              Brotherhood OS
            </span>
          </Link>

          {/* Right: CTAs */}
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/command-center">
                <Button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="text-gold-500 hover:text-gold-400 hover:bg-gold-500/10 border-gold-500/30">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
