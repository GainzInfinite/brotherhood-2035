import { cn } from "@/lib/utils"

interface PrestigeEmblemProps {
  rank: number
  className?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const prestigeData = {
  0: { name: "None", color: "text-gray-400", bgColor: "bg-gray-500/20", borderColor: "border-gray-500/30" },
  1: { name: "Bronze", color: "text-amber-600", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/30" },
  2: { name: "Silver", color: "text-slate-400", bgColor: "bg-slate-400/20", borderColor: "border-slate-400/30" },
  3: { name: "Gold", color: "text-yellow-500", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" },
  4: { name: "Platinum", color: "text-cyan-400", bgColor: "bg-cyan-400/20", borderColor: "border-cyan-400/30" },
  5: { name: "Obsidian", color: "text-purple-600", bgColor: "bg-purple-600/20", borderColor: "border-purple-600/30" }
}

export default function PrestigeEmblem({ rank, className, size = "md", showLabel = true }: PrestigeEmblemProps) {
  const data = prestigeData[rank as keyof typeof prestigeData] || prestigeData[0]
  const isObsidian = rank === 5

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2 font-bold font-mono",
          sizeClasses[size],
          data.bgColor,
          data.borderColor,
          isObsidian && "shadow-lg shadow-gold/50",
          rank >= 3 && "animate-[goldPulse_3s_infinite]"
        )}
        style={isObsidian ? {
          filter: "drop-shadow(0 0 4px rgba(226,183,20,0.3))"
        } : undefined}
      >
        {/* Rank number */}
        <span className={cn("font-bold", data.color)}>
          {rank}
        </span>

        {/* Obsidian glow effect */}
        {isObsidian && (
          <div className="absolute inset-0 bg-gold/20 blur-sm rounded-full animate-pulse" />
        )}
      </div>

      {showLabel && (
        <span className={cn("font-medium text-sm", data.color)}>
          {data.name}
        </span>
      )}
    </div>
  )
}