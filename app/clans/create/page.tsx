'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { ArrowLeft, Crown } from "lucide-react"
import toast from 'react-hot-toast'

export default function CreateClanPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Clan name is required')
      return
    }

    if (formData.name.length > 50) {
      toast.error('Clan name must be 50 characters or less')
      return
    }

    if (formData.description && formData.description.length > 500) {
      toast.error('Description must be 500 characters or less')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/clans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await response.json()

      if (result.success) {
        toast.success(`Clan "${result.clan.name}" created!`)
        // Dispatch a global event so other views (e.g., Command Center) can refresh the clan badge
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('clan:updated'))
        }
        router.push(`/clans/${result.clan.slug}`)
      } else {
        toast.error(result.error || 'Failed to create clan')
      }
    } catch (error) {
      console.error('Error creating clan:', error)
      toast.error('Failed to create clan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/clans">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clans
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">Create Clan</h1>
          <p className="mt-2 text-muted-foreground font-body">
            Establish your brotherhood
          </p>
        </div>
      </div>

      {/* Create Form */}
      <div className="max-w-2xl">
        <PrimaryCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Clan Details</h2>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Clan Name *
              </label>
              <Input
                label="Clan Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your clan name"
                maxLength={50}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.name.length}/50 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                label="Description"
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your clan's mission and values..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            <SecondaryCard>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">As Clan Leader, you can:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set the vision and culture for your clan</li>
                  <li>• Welcome new members and build the brotherhood</li>
                  <li>• Lead by example in daily discipline</li>
                  <li>• Foster accountability and mutual support</li>
                </ul>
              </div>
            </SecondaryCard>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Creating Clan...' : 'Create Clan'}
              </Button>
              <Link href="/clans">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </PrimaryCard>
      </div>
    </div>
  )
}