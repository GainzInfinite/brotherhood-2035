"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "mt-1 h-5 w-5 rounded border-input bg-background text-primary",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"
