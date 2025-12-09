"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  unit?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, unit, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "font-numeric",
              unit && "pr-12",
              error && "border-destructive",
              className
            )}
            {...props}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
