import PrimaryCard from "@/components/PrimaryCard"

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Challenges</h1>
        <p className="mt-2 text-muted-foreground">
          Push your limits with epic challenges
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Active Challenges">
          <p className="text-muted-foreground">No active challenges</p>
        </PrimaryCard>
        
        <PrimaryCard title="Available Challenges">
          <p className="text-muted-foreground">Challenge library coming soon...</p>
        </PrimaryCard>
        
        <PrimaryCard title="Completed">
          <p className="text-muted-foreground">Your victories coming soon...</p>
        </PrimaryCard>
      </div>
    </div>
  )
}
