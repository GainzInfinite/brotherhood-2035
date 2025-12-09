import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SecondaryCardProps {
  title?: string | ReactNode
  children: ReactNode
  className?: string
}

export default function SecondaryCard({ title, children, className }: SecondaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/5 bg-secondary/30 p-5 shadow-md backdrop-blur-sm",
        "animate-[fadeIn_0.45s_ease-out]",
        "hover:bg-secondary/50 hover:border-primary/20 transition-all duration-300",
        className
      )}
    >
      {title && (
        <h4 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider font-heading">{title}</h4>
      )}
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  )
}
