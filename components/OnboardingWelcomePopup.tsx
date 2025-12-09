"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import Crest from "@/components/brand/Crest"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface OnboardingWelcomePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingWelcomePopup({
  isOpen,
  onClose,
}: OnboardingWelcomePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full mx-4 bg-card border border-primary/20 rounded-lg p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="text-center space-y-6">
              {/* Crest */}
              <div className="flex justify-center">
                <Crest className="w-16 h-16 text-gold-400" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground font-cinzel">
                  Welcome, Brother
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your decade begins now.
                </p>
              </div>

              {/* Button */}
              <Button
                onClick={onClose}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 text-lg"
              >
                Enter Command Center
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}