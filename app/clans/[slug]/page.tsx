'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Button } from "@/components/Button"
import { Textarea } from "@/components/Textarea"
import { ArrowLeft, Users, Crown, MessageSquare, Send, Calendar } from "lucide-react"
import toast from 'react-hot-toast'

interface Clan {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
  memberCount: number
  postCount: number
  isMember: boolean
  userRole: string | null
}

interface Member {
  id: number
  userId: string
  role: string
  joinedAt: string
}

interface Post {
  id: number
  userId: string
  content: string
  createdAt: string
}

export default function ClanPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [clan, setClan] = useState<Clan | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const fetchClanData = async () => {
      try {
        const response = await fetch(`/api/clans/${slug}`)
        const result = await response.json()

        if (result.success) {
          setClan(result.clan)
          setMembers(result.members)
          setPosts(result.posts)
        } else {
          toast.error(result.error || 'Clan not found')
          router.push('/clans')
        }
      } catch (error) {
        console.error('Error fetching clan:', error)
        toast.error('Failed to load clan')
        router.push('/clans')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchClanData()
    }
  }, [slug, router])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPost.trim()) {
      toast.error('Post content is required')
      return
    }

    if (newPost.length > 1000) {
      toast.error('Post must be 1000 characters or less')
      return
    }

    setPosting(true)
    try {
      const response = await fetch(`/api/clans/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost })
      })
      const result = await response.json()

      if (result.success) {
        setPosts(prev => [result.post, ...prev])
        setNewPost('')
        toast.success('Post created!')
        // refresh clan metadata (members/posts) in case of changes
        try {
          const refresh = await fetch(`/api/clans/${slug}`)
          const refreshed = await refresh.json()
          if (refreshed.success) {
            setClan(refreshed.clan)
            setMembers(refreshed.members)
            setPosts(refreshed.posts)
          }
        } catch (e) {
          // ignore
        }
        // Update post count
        if (clan) {
          setClan(prev => prev ? { ...prev, postCount: prev.postCount + 1 } : null)
        }
      } else {
        toast.error(result.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-muted/50 rounded animate-pulse" />
          <div>
            <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-96 bg-muted/50 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!clan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/clans">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clans
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clan Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clans">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clans
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">{clan.name}</h1>
          <p className="mt-2 text-muted-foreground font-body">
            {clan.description || 'A brotherhood united in purpose'}
          </p>
        </div>
      </div>

      {/* Clan Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <SecondaryCard>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold text-foreground">{clan.memberCount}</p>
            </div>
          </div>
        </SecondaryCard>

        <SecondaryCard>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Posts</p>
              <p className="text-2xl font-bold text-foreground">{clan.postCount}</p>
            </div>
          </div>
        </SecondaryCard>

        <SecondaryCard>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Founded</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(clan.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>
        </SecondaryCard>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Clan Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          {clan.isMember && (
            <PrimaryCard title="Share with Your Brothers">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts, victories, or seek guidance..."
                  rows={3}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {newPost.length}/1000 characters
                  </p>
                  <Button
                    type="submit"
                    disabled={posting || !newPost.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {posting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </form>
            </PrimaryCard>
          )}

          {/* Posts Feed */}
          <PrimaryCard title="Clan Feed">
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {clan.isMember ? 'Be the first to share with your brothers!' : 'Join the clan to see posts.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {post.userId.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{post.userId}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                  </div>
                ))}
              </div>
            )}
          </PrimaryCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Clan Members */}
          <PrimaryCard title="Clan Members">
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {member.userId.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.userId}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {member.role === 'leader' && (
                    <Crown className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </PrimaryCard>

          {/* Clan Info */}
          <SecondaryCard>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Clan Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${clan.isMember ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {clan.isMember ? 'Member' : 'Not a member'}
                  </span>
                </div>
                {clan.userRole && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Role:</span>
                    <span className="font-medium text-primary">{clan.userRole}</span>
                  </div>
                )}
              </div>
            </div>
          </SecondaryCard>
        </div>
      </div>
    </div>
  )
}