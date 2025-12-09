"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, DollarSign, TrendingUp } from "lucide-react"
import toast from 'react-hot-toast'

interface Holding {
  id: number
  assetName: string
  ticker: string
  quantity: number
  priceUsd: number
  category: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function HoldingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [holding, setHolding] = useState<Holding | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchHolding = async () => {
      try {
        const response = await fetch(`/api/portfolio/${params.id}`)
        const result = await response.json()
        if (result.success) {
          setHolding(result.holding)
        } else {
          toast.error('Holding not found')
          router.push('/wealth/portfolio')
        }
      } catch (error) {
        console.error('Error fetching holding:', error)
        toast.error('Failed to load holding')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchHolding()
    }
  }, [params.id, router])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this holding?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/portfolio/${params.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Holding deleted successfully')
        router.push('/wealth/portfolio')
      } else {
        toast.error(result.error || 'Failed to delete holding')
      }
    } catch (error) {
      console.error('Error deleting holding:', error)
      toast.error('Failed to delete holding')
    } finally {
      setDeleting(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto': return 'text-yellow-500'
      case 'stock': return 'text-green-500'
      case 'etf': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'crypto': return 'bg-yellow-500/20'
      case 'stock': return 'bg-green-500/20'
      case 'etf': return 'bg-blue-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-center">Loading holding...</div>
      </div>
    )
  }

  if (!holding) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-center">Holding not found</div>
      </div>
    )
  }

  const totalValue = holding.quantity * holding.priceUsd

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/wealth/portfolio">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">{holding.assetName}</h1>
            <p className="text-gray-400">{holding.ticker} • {holding.category.charAt(0).toUpperCase() + holding.category.slice(1)}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Asset Details */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-foreground mb-4">Asset Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Asset Name</span>
                <span className="text-foreground font-medium">{holding.assetName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ticker</span>
                <span className="text-foreground font-mono font-medium">{holding.ticker}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBg(holding.category)} ${getCategoryColor(holding.category)}`}>
                  {holding.category.charAt(0).toUpperCase() + holding.category.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantity</span>
                <span className="text-foreground font-mono font-medium">{holding.quantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price per Unit</span>
                <span className="text-foreground font-mono font-medium">{formatCurrency(holding.priceUsd)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {holding.notes && (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-foreground mb-4">Notes</h2>
              <p className="text-muted-foreground">{holding.notes}</p>
            </div>
          )}
        </div>

        {/* Value & Performance */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-foreground mb-4">Value Summary</h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold font-mono mb-2">
                  {formatCurrency(totalValue)}
                </div>
                <p className="text-muted-foreground">Total Value</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400 font-mono">+5.2%</div>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400 font-mono">+12.8%</div>
                  <p className="text-xs text-muted-foreground">7d Change</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-foreground mb-4">Performance</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost Basis</span>
                <span className="text-foreground font-mono">{formatCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Value</span>
                <span className="text-foreground font-mono">{formatCurrency(totalValue * 1.05)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unrealized P&L</span>
                <span className="text-green-400 font-mono font-medium">
                  +{formatCurrency(totalValue * 0.05)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-muted-foreground">Return %</span>
                <span className="text-green-400 font-mono font-medium">+5.0%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-foreground mb-4">Metadata</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Added</span>
                <span className="text-foreground text-sm">
                  {new Date(holding.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-foreground text-sm">
                  {new Date(holding.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}