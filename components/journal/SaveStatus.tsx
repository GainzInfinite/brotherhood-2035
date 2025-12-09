"use client"

import { useEffect, useState, useRef } from 'react'
import { Check } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

interface SaveStatusProps {
  isSaving: boolean
  dirty: boolean
  lastSavedAt: Date | null
}

export default function SaveStatus({ isSaving, dirty, lastSavedAt }: SaveStatusProps) {
  const [showPulse, setShowPulse] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [showTimestamp, setShowTimestamp] = useState(false)
  const [now, setNow] = useState(new Date())

  const pulseTimer = useRef<number | null>(null)
  const fadeStartTimer = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)
  const tickTimer = useRef<number | null>(null)
  const justNowRef = useRef<boolean>(false)

  // When lastSavedAt updates (autosave success), trigger the refined pulse -> fade -> timestamp flow
  useEffect(() => {
    if (!lastSavedAt) return

    // clear any existing timers
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
    if (fadeStartTimer.current) window.clearTimeout(fadeStartTimer.current)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    if (tickTimer.current) window.clearInterval(tickTimer.current)

    // Reset states
    setShowTimestamp(false)
    setIsFading(false)
    setShowPulse(true)
    setIsAnimating(true)

    // Quick pulse (250ms)
    pulseTimer.current = window.setTimeout(() => {
      setIsAnimating(false)
    }, 250)

    // Brief hold until starting fade (start fade at 600ms)
    fadeStartTimer.current = window.setTimeout(() => {
      setIsFading(true)
    }, 600)

    // After fade duration (300ms) — hide check and show timestamp
    hideTimer.current = window.setTimeout(() => {
      setShowPulse(false)
      setIsFading(false)
      // Show timestamp only after fade-out, starting with 'just now'
      justNowRef.current = true
      setShowTimestamp(true)
      // start tick for updating timestamp
      if (tickTimer.current) window.clearInterval(tickTimer.current)
      tickTimer.current = window.setInterval(() => {
        setNow(new Date())
        // after the first tick, stop showing the special 'just now' label
        if (justNowRef.current) {
          justNowRef.current = false
        }
      }, 5000)
    }, 900) // 600 + 300 = 900ms

    return () => {
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
      if (fadeStartTimer.current) window.clearTimeout(fadeStartTimer.current)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      if (tickTimer.current) window.clearInterval(tickTimer.current)
    }
  }, [lastSavedAt])

  // Reset instantly on new edits (dirty true)
  useEffect(() => {
    if (dirty) {
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
      if (fadeStartTimer.current) window.clearTimeout(fadeStartTimer.current)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      if (tickTimer.current) {
        window.clearInterval(tickTimer.current)
        tickTimer.current = null
      }

      setShowPulse(false)
      setIsAnimating(false)
      setIsFading(false)
      setShowTimestamp(false)
      justNowRef.current = false
    }
  }, [dirty])

  return (
    <div role="status" aria-live="polite" data-testid="save-status" className="flex items-center gap-2 text-sm text-muted-foreground">
      {showPulse && !isFading && (
        <Check className="text-gold-400 h-5 w-5 animate-[savePulse_0.25s_ease-out]" />
      )}

      {showPulse && isFading && (
        <Check className="text-gold-400 h-5 w-5 animate-[saveFade_0.3s_ease-out]" />
      )}

      {!showPulse && showTimestamp && lastSavedAt && (
        <span className="text-sm font-medium text-gold-400">
          {justNowRef.current ? 'Saved just now' : `Saved ${formatDistanceToNowStrict(lastSavedAt, { roundingMethod: 'floor' })} ago`}
        </span>
      )}

      {!showPulse && !showTimestamp && (
        <span className="text-sm">
          {isSaving ? 'Saving…' : dirty ? 'Unsaved changes' : lastSavedAt ? `Saved ${formatDistanceToNowStrict(lastSavedAt, { roundingMethod: 'floor' })} ago` : 'All saved'}
        </span>
      )}
    </div>
  )
}
