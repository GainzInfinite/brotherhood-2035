import { Skeleton } from "@/components/ui/skeleton"

export default function JournalLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-12rem)]">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card/50 border border-white/5 rounded-xl p-4">
            <Skeleton className="h-64 w-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-32 px-2" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Center Column Skeleton */}
        <div className="lg:col-span-9">
          <div className="bg-[#1A1A1F] border border-white/5 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[800px]">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            <div className="p-8 space-y-10">
              <div className="space-y-2">
                <Skeleton className="h-12 w-3/4" />
                <div className="h-px w-full bg-white/5" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>

              <Skeleton className="h-32 w-full rounded-lg" />

              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
