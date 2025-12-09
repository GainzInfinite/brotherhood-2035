import { cn } from "@/lib/utils"

interface CrestProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function Crest({ className, size = "md" }: CrestProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Shield background */}
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield shape */}
        <path
          d="M24 4L36 8V20C36 32 30 40 24 44C18 40 12 32 12 20V8L24 4Z"
          fill="#E2B714"
          stroke="#BFA10F"
          strokeWidth="1"
        />

        {/* Inner shield detail */}
        <path
          d="M24 8L32 10V20C32 28 28 34 24 38C20 34 16 28 16 20V10L24 8Z"
          fill="#1A1A1A"
          opacity="0.8"
        />

        {/* "B" monogram */}
        <text
          x="24"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#E2B714"
          fontFamily="serif"
        >
          B
        </text>

        {/* Decorative border */}
        <path
          d="M16 12L20 14M28 14L32 12"
          stroke="#F6D860"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gold/20 blur-sm rounded-full opacity-30" />
    </div>
  )
}