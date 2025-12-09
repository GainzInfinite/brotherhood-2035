"use client"

import { useState } from 'react'
import PrimaryCard from '@/components/PrimaryCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/Textarea'
import { UnifiedCalendar } from '@/components/ui/UnifiedCalendar'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function NewExpensePage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [receivedDate, setReceivedDate] = useState(new Date())
  const [isSaving, setIsSaving] = useState(false)

  const categories = ['Food', 'Transport', 'Bills', 'Subscriptions', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        amount: Number(amount),
        category,
        notes,
        receivedDate: receivedDate.toISOString(),
      }

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to log expense')
        setIsSaving(false)
        return
      }

      toast.success('Expense logged')
      router.push('/wealth')
    } catch (err) {
      console.error(err)
      toast.error('Error logging expense')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PrimaryCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Amount</label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2">
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Date</label>
            <UnifiedCalendar selected={receivedDate} onSelect={(d) => setReceivedDate(d)} />
          </div>

          <div className="pt-4">
            <Button type="submit" className="bg-gold-500 hover:bg-gold-600">{isSaving ? 'Logging...' : 'Log Expense'}</Button>
          </div>
        </form>
      </PrimaryCard>
    </div>
  )
}
