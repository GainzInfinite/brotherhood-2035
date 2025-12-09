"use client"

import { useEffect, useState } from 'react'
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { TrendingUp, BarChart3, Target, Calendar as CalendarIcon, Activity, Brain, DollarSign, Award, ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import { UnifiedCalendar } from "@/components/ui/UnifiedCalendar"
import { Button } from "@/components/ui/button"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

interface AnalyticsData {
  weight: {
    data: Array<{ date: string; weight: number; movingAverage: number }>
    summary: { change30d: number; lowest: number; highest: number } | null
  }
  pushups: Array<{ date: string; pushups: number }>
  steps: {
    data: Array<{ date: string; steps: number }>
    summary: { avg7d: number; change30d: number } | null
  }
  meditation: {
    data: Array<{ date: string; minutes: number }>
    summary: { today: number; avg7d: number; change30d: number } | null
  }
  study: Array<{ date: string; minutes: number }>
  reading: Array<{ date: string; minutes: number }>
  spending: {
    data: Array<{ date: string; amount: number }>
    summary: { today: number; avg7d: number; change30d: number } | null
  }
  income: {
    monthly: Array<{ month: string; total: number; labor: number; passive: number }>
    ytd: Array<{ date: string; cumulative: number }>
  }
  consistency: {
    data: Array<{ date: string; score: number }>
    summary: { avg7d: number; improvement30d: number } | null
  }
  journal: Array<{ date: string; wordCount: number }>
}

interface AnalyticsDashboardProps {
  settings: {
    currency: string
    weightUnit: string
    volumeUnit: string
  } | null
}

export default function AnalyticsDashboard({ settings }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const [showCalendar, setShowCalendar] = useState(false)

  const currency = settings?.currency || 'USD'
  const weightUnit = settings?.weightUnit || 'lbs'
  // volumeUnit not used in current analytics but good to have

  const formatCurrency = (value: number) => {
    if (currency === 'BTC') {
      return `₿${value.toFixed(8)}`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!dateRange.from || !dateRange.to) return

      setLoading(true)
      try {
        const queryParams = new URLSearchParams({
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString()
        })
        const response = await fetch(`/api/analytics?${queryParams}`)
        const result = await response.json()
        if (result.success) {
          setAnalyticsData(result.data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Loading your performance insights...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Unable to load analytics data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">Advanced Analytics</h1>
          <p className="mt-2 text-muted-foreground font-body">
            Deep insights into your performance across all domains
          </p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full md:w-auto justify-start text-left font-normal border-white/10 bg-card hover:bg-accent hover:text-accent-foreground"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
            {showCalendar ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
          
          {showCalendar && (
            <div className="absolute right-0 top-12 z-50">
              <UnifiedCalendar
                mode="range"
                selected={dateRange as any}
                onSelect={(range: any) => {
                  setDateRange(range)
                  if (range?.from && range?.to) {
                    setShowCalendar(false)
                  }
                }}
                className="bg-card border-white/10 shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Consistency Heatmap */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Consistency Heatmap
          </div>
        }>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (29 - i))
                const dateStr = date.toISOString().split('T')[0]
                const dayData = analyticsData.consistency.data.find(d => d.date === dateStr)
                const score = dayData ? dayData.score : 0
                
                // Color scale based on score
                let bgColor = '#374151' // default gray
                if (score > 0) bgColor = '#7f1d1d' // very low (red)
                if (score >= 40) bgColor = '#9a3412' // low (orange)
                if (score >= 60) bgColor = '#eab308' // medium (yellow)
                if (score >= 80) bgColor = '#16a34a' // high (green)
                if (score >= 95) bgColor = '#15803d' // perfect (dark green)

                return (
                  <div
                    key={i}
                    className="w-full pt-[100%] relative rounded-sm"
                    style={{ backgroundColor: bgColor }}
                    title={`${date.toLocaleDateString()}: ${score}%`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Average Consistency</p>
              <p className="font-numeric text-lg font-semibold text-primary">
                {analyticsData.consistency.summary?.avg7d || 0}%
              </p>
            </div>
          </div>
        </PrimaryCard>

        {/* Weight Trend */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weight Trend
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analyticsData.weight.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`${value} ${weightUnit}`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#E2B714"
                  strokeWidth={2}
                  dot={{ fill: '#E2B714', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="movingAverage"
                  stroke="#F59E0B"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            {analyticsData.weight.summary && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">30d Change</p>
                  <p className={`font-numeric text-sm font-semibold ${analyticsData.weight.summary.change30d >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {analyticsData.weight.summary.change30d > 0 ? '+' : ''}{analyticsData.weight.summary.change30d} {weightUnit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lowest</p>
                  <p className="font-numeric text-sm font-semibold text-foreground">{analyticsData.weight.summary.lowest} {weightUnit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Highest</p>
                  <p className="font-numeric text-sm font-semibold text-foreground">{analyticsData.weight.summary.highest} {weightUnit}</p>
                </div>
              </div>
            )}
          </div>
        </PrimaryCard>

        {/* Journal Word Count Trend */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Journal Word Count
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={analyticsData.journal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [value, 'Words']}
                />
                <Bar dataKey="wordCount" fill="#A855F7" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Words (Period)</p>
              <p className="font-numeric text-lg font-semibold text-purple-400">
                {analyticsData.journal.reduce((sum, d) => sum + d.wordCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </PrimaryCard>

        {/* Steps Trend */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Steps Trend
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={analyticsData.steps.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [value.toLocaleString(), 'Steps']}
                />
                <Bar dataKey="steps" fill="#E2B714" />
              </BarChart>
            </ResponsiveContainer>
            {analyticsData.steps.summary && (
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">7-Day Avg</p>
                  <p className="font-numeric text-sm font-semibold text-foreground">{analyticsData.steps.summary.avg7d.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">30d Change</p>
                  <p className={`font-numeric text-sm font-semibold ${analyticsData.steps.summary.change30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analyticsData.steps.summary.change30d > 0 ? '+' : ''}{analyticsData.steps.summary.change30d}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </PrimaryCard>

        {/* Meditation Trend */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Meditation Trend
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={analyticsData.meditation.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} min`, 'Meditation']}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#E2B714"
                  strokeWidth={2}
                  dot={{ fill: '#E2B714', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {analyticsData.meditation.summary && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="font-numeric text-sm font-semibold text-primary">{analyticsData.meditation.summary.today} min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">7-Day Avg</p>
                  <p className="font-numeric text-sm font-semibold text-foreground">{analyticsData.meditation.summary.avg7d} min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">30d Trend</p>
                  <p className={`font-numeric text-sm font-semibold ${analyticsData.meditation.summary.change30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analyticsData.meditation.summary.change30d > 0 ? '+' : ''}{analyticsData.meditation.summary.change30d}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </PrimaryCard>

        {/* Spending Trend */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Spending Trend
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={analyticsData.spending.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Spending']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            {analyticsData.spending.summary && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="font-numeric text-sm font-semibold text-red-400">{formatCurrency(analyticsData.spending.summary.today)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">7-Day Avg</p>
                  <p className="font-numeric text-sm font-semibold text-foreground">{formatCurrency(analyticsData.spending.summary.avg7d)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">30d Trend</p>
                  <p className={`font-numeric text-sm font-semibold ${analyticsData.spending.summary.change30d >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {analyticsData.spending.summary.change30d > 0 ? '+' : ''}{analyticsData.spending.summary.change30d}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </PrimaryCard>

        {/* Income Trend */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Overview
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={analyticsData.income.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name) => [formatCurrency(value), name === 'total' ? 'Total' : name === 'labor' ? 'Labor' : 'Passive']}
                />
                <Bar dataKey="labor" stackId="income" fill="#10B981" />
                <Bar dataKey="passive" stackId="income" fill="#E2B714" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Monthly breakdown</p>
              <p className="font-numeric text-lg font-semibold text-green-400">
                {formatCurrency(analyticsData.income.monthly.reduce((sum, m) => sum + m.total, 0))} total
              </p>
            </div>
          </div>
        </PrimaryCard>

        {/* YTD Income */}
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            YTD Cumulative
          </div>
        }>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={analyticsData.income.ytd}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Cumulative']}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Year-to-date growth</p>
              <p className="font-numeric text-lg font-semibold text-green-400">
                {formatCurrency(analyticsData.income.ytd[analyticsData.income.ytd.length - 1]?.cumulative || 0)}
              </p>
            </div>
          </div>
        </PrimaryCard>

      </div>

      {/* Summary Section */}
      <SecondaryCard title="30-Day Performance Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active Days</p>
            <p className="font-numeric text-2xl font-bold text-primary">
              {analyticsData.consistency.data.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg Consistency</p>
            <p className="font-numeric text-2xl font-bold text-primary">
              {analyticsData.consistency.summary?.avg7d || 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="font-numeric text-2xl font-bold text-green-400">
              {formatCurrency(analyticsData.income.monthly.reduce((sum, m) => sum + m.total, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg Daily Steps</p>
            <p className="font-numeric text-2xl font-bold text-foreground">
              {analyticsData.steps.summary?.avg7d.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </SecondaryCard>
    </div>
  )
}
