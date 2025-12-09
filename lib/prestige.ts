export interface User {
  id: string
  xp: number
  level: number
  prestigeRank: number
  prestigeDate?: Date | null
}

export interface PrestigeCheck {
  canPrestige: boolean
  message?: string
  nextRank?: number
}

/**
 * Check if a user can prestige
 */
export function canPrestige(user: User): PrestigeCheck {
  if (user.level < 10) {
    return {
      canPrestige: false,
      message: `Reach Level 10 to prestige (currently Level ${user.level})`
    }
  }

  if (user.xp < 1000) {
    return {
      canPrestige: false,
      message: `Earn 1,000 XP to prestige (currently ${user.xp} XP)`
    }
  }

  return {
    canPrestige: true,
    nextRank: user.prestigeRank + 1
  }
}

/**
 * Get prestige rank name and styling
 */
export function getPrestigeInfo(rank: number) {
  const prestigeRanks = [
    { name: 'None', color: 'text-muted-foreground', bgColor: 'bg-muted/20' },
    { name: 'Bronze', color: 'text-amber-600', bgColor: 'bg-amber-500/20' },
    { name: 'Silver', color: 'text-slate-400', bgColor: 'bg-slate-400/20' },
    { name: 'Gold', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
    { name: 'Platinum', color: 'text-cyan-400', bgColor: 'bg-cyan-400/20' },
    { name: 'Obsidian', color: 'text-purple-600', bgColor: 'bg-purple-600/20' }
  ]

  return prestigeRanks[rank] || prestigeRanks[0]
}

/**
 * Calculate XP required for next level (simple formula)
 */
export function getXpForLevel(level: number): number {
  return level * 100 // 100 XP per level, can be adjusted
}

/**
 * Calculate level from XP
 */
export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1
}