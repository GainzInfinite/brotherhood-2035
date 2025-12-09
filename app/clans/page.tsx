'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Button } from "@/components/Button"
import { Users, Crown, Plus, LogOut, ExternalLink } from "lucide-react"
import toast from 'react-hot-toast'

interface Clan {
  id: number
  name: string
  slug: string
  description: string | null
  memberCount: number
  isMember: boolean
  role: string | null
}

interface UserClan {
  id: number
  name: string
  slug: string
  role: string
}

export default function ClansPage() {
  const [clans, setClans] = useState<Clan[]>([])
  const [userClan, setUserClan] = useState<UserClan | null>(null)
  const [loading, setLoading] = useState(true)
  const [joiningClan, setJoiningClan] = useState<number | null>(null)
  const [leavingClan, setLeavingClan] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchClans()
  }, [])

  const fetchClans = async () => {
    try {
      const response = await fetch('/api/clans')
      const result = await response.json()
      if (result.success) {
        setClans(result.clans)
        setUserClan(result.userClan)
      }
    } catch (error) {
      console.error('Error fetching clans:', error)
      toast.error('Failed to load clans')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClan = async (clanId: number) => {
    setJoiningClan(clanId)
    try {
      const response = await fetch('/api/clans/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clanId })
      })
      const result = await response.json()

      if (result.success) {
        toast.success(`Joined ${result.membership.clanName}!`)
        await fetchClans() // Refresh data
        // Notify other parts of the app to refresh clan state (e.g., Command Center badge)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('clan:updated'))
        }
      } else {
        toast.error(result.error || 'Failed to join clan')
      }
    } catch (error) {
      console.error('Error joining clan:', error)
      toast.error('Failed to join clan')
    } finally {
      setJoiningClan(null)
    }
  }

  const handleLeaveClan = async () => {
    setLeavingClan(true)
    try {
      const response = await fetch('/api/clans/membership', {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        if (result.deletedClan) {
          toast.success(`Deleted ${result.deletedClan.name}`)
          setUserClan(null)
          await fetchClans()
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('clan:updated'))
          }
        } else {
          toast.success(`Left ${result.leftClan.name}`)
          setUserClan(null)
          await fetchClans() // Refresh data
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('clan:updated'))
          }
        }
      } else {
        toast.error(result.error || 'Failed to leave clan')
      }
    } catch (error) {
      console.error('Error leaving clan:', error)
      toast.error('Failed to leave clan')
    } finally {
      setLeavingClan(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clans</h1>
          <p className="mt-2 text-muted-foreground">Loading clans...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">Clans</h1>
        <p className="mt-2 text-muted-foreground font-body">
          Join forces with your brothers in the pursuit of excellence
        </p>
      </div>

      {/* User's Clan Status */}
      {userClan ? (
        <PrimaryCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your Clan</h3>
                <p className="text-primary font-medium">{userClan.name}</p>
                <p className="text-sm text-muted-foreground">Role: {userClan.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/clans/${userClan.slug}`)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Clan
              </Button>
              <Button
                variant="outline"
                onClick={handleLeaveClan}
                disabled={leavingClan}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {leavingClan ? 'Leaving...' : 'Leave Clan'}
              </Button>
            </div>
          </div>
        </PrimaryCard>
      ) : (
        <SecondaryCard>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Not in a Clan</h3>
              <p className="text-muted-foreground">Join a clan to connect with like-minded brothers</p>
            </div>
            <Link href="/clans/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Clan
              </Button>
            </Link>
          </div>
        </SecondaryCard>
      )}

      {/* Available Clans */}
      <div>
        <h2 className="text-2xl font-bold text-foreground font-heading mb-4">
          {userClan ? 'Other Clans' : 'Available Clans'}
        </h2>

        {clans.length === 0 ? (
          <SecondaryCard>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No clans yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to create a clan!</p>
              <Link href="/clans/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Clan
                </Button>
              </Link>
            </div>
          </SecondaryCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clans
              .filter(clan => !clan.isMember) // Only show clans user is not in
              .map((clan) => (
                <PrimaryCard key={clan.id} title={clan.name}>
                  <div className="space-y-4">
                    {clan.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clan.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {clan.memberCount} members
                      </div>
                      <Button
                        onClick={() => handleJoinClan(clan.id)}
                        disabled={joiningClan === clan.id}
                        size="sm"
                      >
                        {joiningClan === clan.id ? 'Joining...' : 'Join'}
                      </Button>
                    </div>
                  </div>
                </PrimaryCard>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
