"use client"

import { useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex items-center justify-center`}>
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Critical System Failure</h1>
          <p className="text-muted-foreground mb-8">The application encountered a critical error.</p>
          <button
            onClick={() => reset()}
            className="bg-[#E2B714] text-black font-semibold px-6 py-2 rounded-md hover:bg-[#f6d860] transition-colors"
          >
            Reboot System
          </button>
        </div>
      </body>
    </html>
  )
}
