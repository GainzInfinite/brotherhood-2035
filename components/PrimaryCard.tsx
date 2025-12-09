import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PrimaryCardProps {
  title?: string | ReactNode
  children: ReactNode
  className?: string
}

export default function PrimaryCard({ title, children, className }: PrimaryCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/5 bg-card p-6 shadow-xl",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-50",
        "after:absolute after:inset-0 after:bg-noise after:opacity-[0.03] after:mix-blend-overlay",
        "animate-[fadeIn_0.45s_ease-out]",
        "hover:border-primary/30 hover:shadow-gold transition-all duration-300",
        className
      )}
    >
      {title && (
        <h3 className="relative z-10 mb-4 text-lg font-semibold text-primary tracking-wide uppercase font-heading border-b border-white/5 pb-2">
          {title}
        </h3>
      )}
      <div className="relative z-10 text-foreground">{children}</div>
    </div>
  )
}
