"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UnifiedCalendar } from "@/components/ui/UnifiedCalendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, DollarSign } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

export default function EditIncomePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("")
  const [type, setType] = useState<"labor" | "passive">("labor")

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await fetch(`/api/income/${params.id}`)
        const result = await response.json()
        
        if (result.success) {
          const log = result.data
          setAmount(log.amount.toString())
          setSource(log.source)
          setType(log.incomeType.toLowerCase() as "labor" | "passive")
          setDate(new Date(log.receivedDate))
        } else {
          toast.error(result.error || "Failed to load income log")
          router.push("/wealth")
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to load income log")
        router.push("/wealth")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLog()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/income/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          source,
          incomeType: type,
          receivedDate: date,
          currency: "USD"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update income")
      }

      toast.success("Income updated")
      
      // Navigate back after a brief delay to show success
      setTimeout(() => {
        router.push("/wealth")
        router.refresh()
      }, 500)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/wealth" 
          className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Edit Income</h1>
          <p className="text-muted-foreground">Update your earnings record</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-10 bg-card border-white/10 focus:border-primary/50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="e.g. Salary, Client Project, Dividends"
              className="bg-card border-white/10 focus:border-primary/50"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Income Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType("labor")}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  type === "labor"
                    ? "bg-primary/10 border-primary text-primary shadow-gold"
                    : "bg-card border-white/10 text-muted-foreground hover:bg-white/5"
                }`}
              >
                <div className="font-semibold mb-1">Labor Income</div>
                <div className="text-xs opacity-80">Active work, salary, contracting</div>
              </button>
              <button
                type="button"
                onClick={() => setType("passive")}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  type === "passive"
                    ? "bg-primary/10 border-primary text-primary shadow-gold"
                    : "bg-card border-white/10 text-muted-foreground hover:bg-white/5"
                }`}
              >
                <div className="font-semibold mb-1">Passive Income</div>
                <div className="text-xs opacity-80">Investments, dividends, royalties</div>
              </button>
            </div>
          </div>

          <div className="md:hidden space-y-2">
            <Label>Date Received</Label>
            <div className="p-4 bg-card border border-white/10 rounded-xl text-center">
              {format(date, "MMMM d, yyyy")}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Income"
            )}
          </Button>
        </form>

        <div className="hidden md:block space-y-2">
          <Label>Date Received</Label>
          <UnifiedCalendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
