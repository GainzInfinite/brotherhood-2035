"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Crest from "@/components/brand/Crest"
import { Menu, X } from "lucide-react"
import {
  Home,
  Heart,
  DollarSign,
  Brain,
  ClipboardCheck,
  Trophy,
  Award,
  User,
  Users,
  BarChart3,
  Settings,
  Baby,
  BookOpen,
  Plus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const routes = [
  { name: "Command Center", path: "/command-center", icon: Home },
  { name: "Health", path: "/health", icon: Heart },
  { name: "Wealth", path: "/wealth", icon: DollarSign },
  { name: "Mind", path: "/mind", icon: Brain },
  { name: "Check-In", path: "/check-in", icon: ClipboardCheck },
  { name: "Challenges", path: "/challenges", icon: Trophy },
  { name: "Achievements", path: "/achievements", icon: Award },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Clans", path: "/clans", icon: Users },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Journal", path: "/journal", icon: BookOpen },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Fatherhood", path: "/fatherhood", icon: Baby },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-card border border-border rounded-lg p-2 shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card md:hidden"
          >
            <SidebarContent onClose={() => setIsOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

const SidebarContent = ({ onClose }: { onClose: () => void }) => {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden text-muted-foreground hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Logo/Brand */}
      <div className="flex flex-col items-center justify-center border-b border-border py-6 px-6 space-y-2">
        <Crest size="lg" />
        <div className="text-center">
          <h1 className="text-lg font-bold text-primary font-cinzel">BROTHERHOOD</h1>
          <p className="text-xs text-muted-foreground font-cinzel">OS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {routes.map((route) => {
          const isActive = pathname === route.path
          const Icon = route.icon

          return (
            <Link
              key={route.path}
              href={route.path}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="tracking-wide">{route.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Add Income CTA */}
      <div className="px-4 pb-4">
        <Link
          href="/wealth/income/new"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-br from-gold-500 to-gold-400 text-black font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Add Income</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">© 2035 Brotherhood</p>
      </div>
    </div>
  )
}
