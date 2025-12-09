"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Landmark, TrendingUp, PiggyBank, HandCoins, BarChart3, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import IncomeLogList from "./income/IncomeLogList"
import { Skeleton } from "@/components/ui/skeleton"

interface WealthData {
  netWorth: {
    value: number;
    change: number;
  };
  income: {
    monthly: number;
    ytd: number;
  };
  savingsRate: {
    monthly: number;
    ytd: number;
  };
  debt: {
    total: number;
    change: number;
  };
}

interface WealthDashboardProps {
  settings: {
    currency: string;
  } | null;
}

export default function WealthDashboard({ settings }: WealthDashboardProps) {
  const [wealthData, setWealthData] = useState<WealthData | null>(null);
  const [spendSummary, setSpendSummary] = useState<{ monthly: number; ytd: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const currency = settings?.currency || 'USD';

  useEffect(() => {
    const fetchWealthData = async () => {
      try {
        const response = await fetch('/api/wealth');
        const result = await response.json();
        if (result.success) {
          setWealthData(result.data);
        } else {
          setError(result.error || 'Failed to fetch wealth data.');
        }
        // Fetch spending summary from expenses API (monthly/YTD)
        try {
          const spendRes = await fetch('/api/expenses/summary', { cache: 'no-store' })
          const spendData = await spendRes.json()
          if (spendData.success && spendData.summary) {
            setSpendSummary(spendData.summary)
          } else {
            setSpendSummary({ monthly: 0, ytd: 0 })
          }
        } catch {
          setSpendSummary({ monthly: 0, ytd: 0 })
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWealthData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </div>
        
        <div className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (error || !wealthData) {
    return (
      <div className="text-center text-destructive">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{error || 'Could not load wealth data.'}</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (currency === 'BTC') {
      return `₿${value.toFixed(8)}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-primary';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Wealth Module</h1>
          <p className="mt-2 text-muted-foreground font-medium">
            Monitor your financial growth, income, and investments.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/wealth/income/new")}
            className="flex items-center gap-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Log Income</span>
            <span className="sm:hidden">Income</span>
          </button>
          <button
            onClick={() => router.push("/wealth/expense/new")}
            className="flex items-center gap-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Log Expense</span>
            <span className="sm:hidden">Expense</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <PrimaryCard title="Net Worth">
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <span className="font-numeric text-5xl font-bold text-foreground">
              {formatCurrency(wealthData.netWorth.value)}
            </span>
            <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(wealthData.netWorth.change)}`}>
              <TrendingUp className="h-4 w-4" />
              <span>{wealthData.netWorth.change >= 0 ? '+' : ''}{formatCurrency(wealthData.netWorth.change)} (30d)</span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            <span>This Month vs YTD</span>
            <span className="ml-2 text-xs text-muted-foreground" title="Based on received date, not entry date">(?)</span>
          </div>
        }>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spending — This Month</span>
              <span className="font-numeric text-xl font-semibold text-foreground">{formatCurrency(spendSummary?.monthly || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spending — YTD</span>
              <span className="font-numeric text-lg font-medium text-foreground">{formatCurrency(spendSummary?.ytd || 0)}</span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Income">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {formatCurrency(wealthData.income.monthly)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">YTD</span>
              <span className="font-numeric text-lg font-medium text-foreground">
                {formatCurrency(wealthData.income.ytd)}
              </span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Savings Rate">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">This Month</span>
              </div>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {formatPercentage(wealthData.savingsRate.monthly)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">YTD</span>
              <span className="font-numeric text-lg font-medium text-foreground">
                {formatPercentage(wealthData.savingsRate.ytd)}
              </span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Debt">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HandCoins className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {formatCurrency(wealthData.debt.total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">30d Change</span>
              <span className={`font-numeric text-lg font-medium ${getChangeColor(wealthData.debt.change)}`}>
                {wealthData.debt.change >= 0 ? '+' : ''}{formatCurrency(wealthData.debt.change)}
              </span>
            </div>
          </div>
        </PrimaryCard>
      </div>

      {/* Additional Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecondaryCard title="Portfolio">
          <p className="text-sm text-muted-foreground">
            Track your investment performance across all accounts.
          </p>
          <Link
            href="/portfolio"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Portfolio
          </Link>
        </SecondaryCard>

        <SecondaryCard title="Analytics">
          <p className="text-sm text-muted-foreground">
            Deep dive into your financial data and trends.
          </p>
          <Link
            href="/analytics"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Link>
        </SecondaryCard>
      </div>

      <IncomeLogList />
      
      {spendSummary && (spendSummary.monthly > 0 || spendSummary.ytd > 0) && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Expense Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="font-mono text-base font-semibold text-foreground">{formatCurrency(spendSummary.monthly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Year to Date</span>
              <span className="font-mono text-base font-semibold text-foreground">{formatCurrency(spendSummary.ytd)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
