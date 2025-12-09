"use client"

import { useState, useEffect } from "react"
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { BrainCircuit, BookOpen, Sunrise, Moon, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"

interface MindData {
  clarity: {
    rating: number;
    delta: number;
  };
  learning: {
    today: number;
    weekly: number;
  };
  rituals: {
    am: boolean;
    pm: boolean;
  };
}

export default function MindDashboard() {
  const [mindData, setMindData] = useState<MindData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMindData = async () => {
      try {
        const response = await fetch('/api/mind');
        const result = await response.json();
        if (result.success) {
          setMindData(result.data);
        } else {
          setError(result.error || 'Failed to fetch mind data.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMindData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !mindData) {
    return (
      <div className="text-center text-destructive">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{error || 'Could not load mind data.'}</p>
      </div>
    );
  }

  const getClarityColor = (delta: number) => {
    if (delta > 0) return 'text-primary';
    if (delta < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mind Module</h1>
        <p className="mt-2 text-muted-foreground">
          Cultivate mental clarity, focus, and continuous learning.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Mental Clarity">
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <div className="flex items-baseline">
              <span className="font-numeric text-5xl font-bold text-foreground">
                {mindData.clarity.rating}
              </span>
              <span className="text-lg text-muted-foreground">/10</span>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${getClarityColor(mindData.clarity.delta)}`}>
              <BrainCircuit className="h-4 w-4" />
              <span>{mindData.clarity.delta >= 0 ? '+' : ''}{mindData.clarity.delta}% vs 7-day avg</span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Learning">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {mindData.learning.today} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-numeric text-lg font-medium text-foreground">
                {(mindData.learning.weekly / 60).toFixed(1)} hr
              </span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Daily Rituals">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunrise className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">AM Ritual</span>
              </div>
              <span className={`text-sm font-medium ${
                mindData.rituals.am ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {mindData.rituals.am ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">PM Ritual</span>
              </div>
              <span className={`text-sm font-medium ${
                mindData.rituals.pm ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {mindData.rituals.pm ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </PrimaryCard>
      </div>

      {/* Additional Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecondaryCard title="Journal">
          <p className="text-sm text-muted-foreground">
            Organize your thoughts, reflect on your day, and plan for tomorrow.
          </p>
          <Link
            href="/journal"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open Journal
          </Link>
        </SecondaryCard>

        <SecondaryCard title="Analytics">
          <p className="text-sm text-muted-foreground">
            Gain insights into your mental patterns and progress.
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
    </div>
  )
}
