import PrimaryCard from "@/components/PrimaryCard"

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="mt-2 text-muted-foreground">
          Your badges of honor and earned recognition
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Badges">
          <p className="text-muted-foreground">Badge system coming soon...</p>
        </PrimaryCard>
        
        <PrimaryCard title="Milestones">
          <p className="text-muted-foreground">Major milestones coming soon...</p>
        </PrimaryCard>
        
        <PrimaryCard title="Rank">
          <p className="text-muted-foreground">Brotherhood rank coming soon...</p>
        </PrimaryCard>
      </div>
    </div>
  )
}
