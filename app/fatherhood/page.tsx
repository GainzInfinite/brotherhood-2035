import PrimaryCard from "@/components/PrimaryCard"

export default function FatherhoodPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fatherhood Module</h1>
        <p className="mt-2 text-muted-foreground">
          Lead your family with wisdom and strength (Optional Module)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Family Goals">
          <p className="text-muted-foreground">Family planning coming soon...</p>
        </PrimaryCard>
        
        <PrimaryCard title="Parenting Resources">
          <p className="text-muted-foreground">Guidance library coming soon...</p>
        </PrimaryCard>
        
        <PrimaryCard title="Legacy Planning">
          <p className="text-muted-foreground">Build your legacy coming soon...</p>
        </PrimaryCard>
      </div>
    </div>
  )
}
