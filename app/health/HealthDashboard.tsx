"use client"

import { useState, useEffect } from "react"
import PrimaryCard from "@/components/PrimaryCard"
import SecondaryCard from "@/components/SecondaryCard"
import { Scale, Activity, Footprints, Dumbbell, Bike, Droplets, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"

interface HealthData {
  weight: {
    latest: number;
    sevenDayAvg: number;
    thirtyDayDelta: number;
  };
  pushups: {
    today: number;
    sevenDayTotal: number;
    thirtyDayBest: number;
  };
  steps: {
    today: number;
    sevenDayAvg: number;
    thirtyDayTrend: string;
  };
  training: {
    weightTraining: boolean;
    bikeMinutes: number;
    waterIntake: number;
  };
}

interface HealthDashboardProps {
  settings: {
    weightUnit: string;
    volumeUnit: string;
  } | null;
}

export default function HealthDashboard({ settings }: HealthDashboardProps) {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weightUnit = settings?.weightUnit || 'lbs';
  const volumeUnit = settings?.volumeUnit || 'oz';

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('/api/health');
        const result = await response.json();
        if (result.success) {
          setHealthData(result.data);
        } else {
          setError(result.error || 'Failed to fetch health data.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !healthData) {
    return (
      <div className="text-center text-destructive">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{error || 'Could not load health data.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health Module</h1>
        <p className="mt-2 text-muted-foreground">
          Track your fitness, nutrition, and physical performance
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PrimaryCard title="Weight Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Latest</span>
              </div>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {healthData.weight.latest} {weightUnit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">7-Day Avg</span>
              <span className="font-numeric text-lg font-medium text-foreground">
                {healthData.weight.sevenDayAvg} {weightUnit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">30-Day Delta</span>
              <span className={`font-numeric text-lg font-medium ${
                healthData.weight.thirtyDayDelta <= 0 ? 'text-primary' : 'text-destructive'
              }`}>
                {healthData.weight.thirtyDayDelta > 0 ? '+' : ''}{healthData.weight.thirtyDayDelta} {weightUnit}
              </span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Pushup Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {healthData.pushups.today}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">7-Day Total</span>
              <span className="font-numeric text-lg font-medium text-foreground">
                {healthData.pushups.sevenDayTotal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">30-Day Best</span>
              <span className="font-numeric text-lg font-medium text-primary">
                {healthData.pushups.thirtyDayBest}
              </span>
            </div>
          </div>
        </PrimaryCard>

        <PrimaryCard title="Steps Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Footprints className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <span className="font-numeric text-xl font-semibold text-foreground">
                {healthData.steps.today.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">7-Day Avg</span>
              <span className="font-numeric text-lg font-medium text-foreground">
                {healthData.steps.sevenDayAvg.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">30-Day Trend</span>
              <span className="font-numeric text-lg font-medium text-primary">
                {healthData.steps.thirtyDayTrend}
              </span>
            </div>
          </div>
        </PrimaryCard>
      </div>

      {/* Training Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecondaryCard title="Today's Training">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Weight Training</span>
              </div>
              <span className={`text-sm font-medium ${
                healthData.training.weightTraining ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {healthData.training.weightTraining ? 'Completed' : 'Not Done'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Bike Minutes</span>
              </div>
              <span className="font-numeric text-sm font-medium text-foreground">
                {healthData.training.bikeMinutes} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Water Intake</span>
              </div>
              <span className="font-numeric text-sm font-medium text-foreground">
                {healthData.training.waterIntake} {volumeUnit}
              </span>
            </div>
          </div>
        </SecondaryCard>

        <SecondaryCard title="Analytics">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              View detailed health trends and progress over time.
            </p>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Link>
          </div>
        </SecondaryCard>
      </div>
    </div>
  )
}
