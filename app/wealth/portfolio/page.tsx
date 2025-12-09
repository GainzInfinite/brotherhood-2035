"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Plus, TrendingUp, DollarSign, PieChart as PieChartIcon, Table, RefreshCw } from "lucide-react"

interface Holding {
  id: number
  assetName: string
  ticker?: string | null
  quantity: number
  priceUsd: number
  category: string
  yieldRate?: number | null
  isApiLinked: boolean
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface PortfolioSummary {
  totalValue: number
  totalAssets: number
  categoryBreakdown: Record<string, number>
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio')
      const result = await response.json()
      if (result.success) {
        setHoldings(result.holdings)
        setSummary(result.summary)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto': return '#f59e0b' // gold
      case 'stock': return '#10b981' // green
      case 'etf': return '#3b82f6' // blue
      case 'savings': return '#8b5cf6' // purple
      case 'real_estate': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

  const pieData = summary ? Object.entries(summary.categoryBreakdown).map(([category, value]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
    value,
    color: getCategoryColor(category)
  })) : []

  // Calculate projected income
  const projectedMonthlyIncome = holdings.reduce((sum, h) => {
    if (h.yieldRate) {
      const annualIncome = (h.quantity * h.priceUsd) * (h.yieldRate / 100)
      return sum + (annualIncome / 12)
    }
    return sum
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-center">Loading portfolio...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">Portfolio</h1>
            <p className="text-gray-400">Track your wealth accumulation</p>
          </div>
          <Link href="/wealth/portfolio/new">
            <button className="flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Total Portfolio Value
          </div>
        }>
          <div className="space-y-4">
            <div className="text-3xl font-bold text-gold font-numeric">
              {formatCurrency(summary?.totalValue || 0)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Assets</span>
              <span className="font-numeric text-lg font-semibold text-foreground">{summary?.totalAssets || 0}</span>
            </div>
            <div className="space-y-2">
              {Object.entries(summary?.categoryBreakdown || {}).map(([category, value]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground capitalize">{category.replace('_', ' ')}</span>
                  <span className="font-numeric text-sm font-semibold text-foreground">{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Asset Allocation
          </div>
        }>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: 'black' }}
                  contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-1">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.name}</span>
                <span className="text-sm font-numeric ml-auto">
                  {((entry.value / (summary?.totalValue || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </PrimaryCard>

        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Income Projection
          </div>
        }>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 font-numeric">
                +{formatCurrency(projectedMonthlyIncome)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Passive Income</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gold font-numeric">
                +{formatCurrency(projectedMonthlyIncome * 12)}
              </div>
              <p className="text-sm text-muted-foreground">Annual Projection</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground font-numeric">
                {((projectedMonthlyIncome * 12) / (summary?.totalValue || 1) * 100).toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground">Portfolio Yield</p>
            </div>
          </div>
        </PrimaryCard>
      </div>

      {/* Holdings Table */}
      <SecondaryCard title={
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5" />
          Holdings
        </div>
      }>
        {holdings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No holdings yet</p>
            <Link href="/wealth/portfolio/new">
              <button className="bg-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors">
                Add Your First Holding
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Asset</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ticker</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Balance/Qty</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Yield</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <Link href={`/wealth/portfolio/${holding.id}`}>
                        <span className="font-medium text-foreground hover:text-gold cursor-pointer">
                          {holding.assetName}
                        </span>
                      </Link>
                      {holding.isApiLinked && (
                        <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full" title="Live Price Linked" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{holding.ticker || '-'}</td>
                    <td className="py-3 px-4 text-right font-numeric">
                      {holding.category === 'savings' 
                        ? holding.quantity.toLocaleString(undefined, { style: 'currency', currency: holding.currency })
                        : holding.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-numeric">
                      {holding.category === 'savings' && holding.currency === 'USD' 
                        ? '-' 
                        : formatCurrency(holding.priceUsd)}
                    </td>
                    <td className="py-3 px-4 text-right font-numeric font-semibold text-gold">
                      {formatCurrency(holding.quantity * holding.priceUsd)}
                    </td>
                    <td className="py-3 px-4 text-right font-numeric">
                      {holding.yieldRate ? (
                        <span className="text-green-400">{holding.yieldRate}%</span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        holding.category === 'crypto' ? 'bg-yellow-500/20 text-yellow-600' :
                        holding.category === 'stock' ? 'bg-green-500/20 text-green-600' :
                        holding.category === 'etf' ? 'bg-blue-500/20 text-blue-600' :
                        holding.category === 'savings' ? 'bg-purple-500/20 text-purple-400' :
                        holding.category === 'real_estate' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {holding.category.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SecondaryCard>
    </div>
  )
}
