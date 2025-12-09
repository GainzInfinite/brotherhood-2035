"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface IncomeLog {
  id: number
  amount: number
  currency: string
  source: string
  incomeType: string
  receivedDate: string
}

export default function IncomeLogList() {
  const [logs, setLogs] = useState<IncomeLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/income')
      const result = await response.json()
      if (result.success) {
        setLogs(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch income logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this income log?')) return

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/income/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setLogs(logs.filter(log => log.id !== id))
        router.refresh() // Refresh server components if any
      } else {
        alert('Failed to delete log')
      }
    } catch (error) {
      console.error('Error deleting log:', error)
      alert('Error deleting log')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/wealth/income/${id}/edit`)
  }
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-24" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-border rounded-lg text-muted-foreground">
        No income logs found. Start tracking your wealth.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Recent Income</h3>
      </div>
      <div className="divide-y divide-border">
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-accent/50 transition-colors">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="font-medium truncate">{log.source}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {log.incomeType.toLowerCase()} • {format(new Date(log.receivedDate), 'MMM d, yyyy')}
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="font-numeric font-semibold text-green-500">
                +{new Intl.NumberFormat('en-US', { style: 'currency', currency: log.currency }).format(log.amount)}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(log.id)}
                  className="p-2 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(log.id)}
                  disabled={isDeleting === log.id}
                  className="p-2 hover:bg-background rounded-md text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  {isDeleting === log.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
