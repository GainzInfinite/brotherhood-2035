"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="mb-8 p-6 rounded-full bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      
      <h1 className="text-4xl font-bold font-heading text-foreground mb-4">
        Something went wrong
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        We encountered an unexpected issue. The Brotherhood is resilient—try again or return to base.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={reset}
          className="bg-gold-500 hover:bg-gold-600 text-black font-semibold min-w-[140px]"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        
        <Link href="/command-center">
          <Button variant="outline" className="min-w-[140px] border-white/10 hover:bg-white/5">
            <Home className="mr-2 h-4 w-4" />
            Return to Base
          </Button>
        </Link>
      </div>
      
      {error.digest && (
        <p className="mt-12 text-xs text-muted-foreground/50 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
