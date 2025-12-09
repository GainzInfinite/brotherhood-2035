import { cn } from "@/lib/utils"
import { Cinzel } from "next/font/google"

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export default function SectionHeading({
  children,
  className,
  level = 2
}: SectionHeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <div className={cn("relative pb-4", className)}>
      <Component
        className={cn(
          cinzel.className,
          "text-gold font-semibold uppercase tracking-wider text-lg"
        )}
      >
        {children}
      </Component>
      <div className="absolute bottom-0 left-0 h-[2px] w-12 bg-gold animate-[shimmer_2s_infinite]" />
    </div>
  )
}