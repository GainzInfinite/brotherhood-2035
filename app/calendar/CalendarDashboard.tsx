"use client"

import { useState } from "react"
import { UnifiedCalendar, CalendarMarker } from "@/components/ui/UnifiedCalendar"
import PrimaryCard from "@/components/PrimaryCard"
import { format, isSameDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dumbbell, 
  Brain, 
  Wallet, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  Activity,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyLog {
  date: Date
  weight: number | null
  pushups: number | null
  steps: number | null
  meditationMinutes: number | null
  readingMinutes: number | null
  studyMinutes: number | null
  spendToday: number | null
  incomeToday: number | null
  consistencyScore: number | null
}

interface JournalEntry {
  date: Date
  id: number
  title: string | null
}

interface CalendarDashboardProps {
  dailyLogs: DailyLog[]
  journalEntries: JournalEntry[]
  settings: {
    currency: string;
    weightUnit: string;
  } | null;
}

export default function CalendarDashboard({ dailyLogs, journalEntries, settings }: CalendarDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const currency = settings?.currency || 'USD';
  const weightUnit = settings?.weightUnit || 'lbs';

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

  // Generate markers
  const markers: CalendarMarker[] = []

  dailyLogs.forEach(log => {
    const date = new Date(log.date)
    
    // Health Marker (Green) - if any physical activity
    if (log.pushups || log.steps || log.weight) {
      markers.push({
        date,
        color: "bg-emerald-500",
        tooltip: "Health Activity"
      })
    }

    // Mind Marker (Blue) - if meditation or reading
    if (log.meditationMinutes || log.readingMinutes || log.studyMinutes) {
      markers.push({
        date,
        color: "bg-blue-500",
        tooltip: "Mind Activity"
      })
    }

    // Wealth Marker (Gold) - if income or tracking spending
    if (log.incomeToday || log.spendToday) {
      markers.push({
        date,
        color: "bg-yellow-500",
        tooltip: "Wealth Activity"
      })
    }
  })

  journalEntries.forEach(entry => {
    const date = new Date(entry.date)
    markers.push({
      date,
      color: "bg-purple-500",
      tooltip: "Journal Entry"
    })
  })

  // Get data for selected date
  const selectedLog = dailyLogs.find(log => isSameDay(new Date(log.date), selectedDate))
  const selectedJournal = journalEntries.find(entry => isSameDay(new Date(entry.date), selectedDate))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-4 space-y-6">
        <PrimaryCard title="Consistency Calendar">
          <div className="flex justify-center p-4">
            <UnifiedCalendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              markers={markers}
              className="w-full max-w-none bg-transparent border-none shadow-none"
            />
          </div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Health</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Mind</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Wealth</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500" /> Journal</div>
          </div>
        </PrimaryCard>
      </div>

      {/* Details Section */}
      <div className="lg:col-span-8">
        <PrimaryCard title={
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Daily Report: {format(selectedDate, "MMMM do, yyyy")}</span>
          </div>
        }>
          <div className="space-y-6 min-h-[400px]">
            {!selectedLog && !selectedJournal ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-20">
                <XCircle className="h-16 w-16 mb-4" />
                <p className="text-lg">No records found for this day.</p>
                <p className="text-sm">Seize the day and log your progress.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Stats */}
                <div className="bg-card/30 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Dumbbell className="h-4 w-4" />
                    <h3 className="font-cinzel text-sm uppercase tracking-wider">Health</h3>
                  </div>
                  {selectedLog?.pushups ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pushups</span>
                      <span className="font-mono text-foreground">{selectedLog.pushups}</span>
                    </div>
                  ) : null}
                  {selectedLog?.steps ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Steps</span>
                      <span className="font-mono text-foreground">{selectedLog.steps.toLocaleString()}</span>
                    </div>
                  ) : null}
                  {selectedLog?.weight ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-mono text-foreground">{selectedLog.weight} {weightUnit}</span>
                    </div>
                  ) : null}
                  {!selectedLog?.pushups && !selectedLog?.steps && !selectedLog?.weight && (
                    <p className="text-xs text-muted-foreground italic">No health metrics logged.</p>
                  )}
                </div>

                {/* Mind Stats */}
                <div className="bg-card/30 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Brain className="h-4 w-4" />
                    <h3 className="font-cinzel text-sm uppercase tracking-wider">Mind</h3>
                  </div>
                  {selectedLog?.meditationMinutes ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Meditation</span>
                      <span className="font-mono text-foreground">{selectedLog.meditationMinutes} min</span>
                    </div>
                  ) : null}
                  {selectedLog?.readingMinutes ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Reading</span>
                      <span className="font-mono text-foreground">{selectedLog.readingMinutes} min</span>
                    </div>
                  ) : null}
                  {selectedLog?.studyMinutes ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Study</span>
                      <span className="font-mono text-foreground">{selectedLog.studyMinutes} min</span>
                    </div>
                  ) : null}
                  {!selectedLog?.meditationMinutes && !selectedLog?.readingMinutes && !selectedLog?.studyMinutes && (
                    <p className="text-xs text-muted-foreground italic">No mind metrics logged.</p>
                  )}
                </div>

                {/* Wealth Stats */}
                <div className="bg-card/30 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Wallet className="h-4 w-4" />
                    <h3 className="font-cinzel text-sm uppercase tracking-wider">Wealth</h3>
                  </div>
                  {selectedLog?.incomeToday ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Income</span>
                      <span className="font-mono text-foreground text-green-400">+{formatCurrency(selectedLog.incomeToday)}</span>
                    </div>
                  ) : null}
                  {selectedLog?.spendToday ? (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-mono text-foreground text-red-400">-{formatCurrency(selectedLog.spendToday)}</span>
                    </div>
                  ) : null}
                  {!selectedLog?.incomeToday && !selectedLog?.spendToday && (
                    <p className="text-xs text-muted-foreground italic">No wealth metrics logged.</p>
                  )}
                </div>

                {/* Journal Entry */}
                <div className="bg-card/30 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <h3 className="font-cinzel text-sm uppercase tracking-wider">Journal</h3>
                  </div>
                  {selectedJournal ? (
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">{selectedJournal.title || "Untitled Entry"}</div>
                      <div className="text-xs text-muted-foreground">
                        Entry recorded at {format(new Date(selectedJournal.date), "h:mm a")}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No journal entry for this day.</p>
                  )}
                </div>

                {/* Consistency Score */}
                {selectedLog?.consistencyScore !== null && selectedLog?.consistencyScore !== undefined && (
                  <div className="md:col-span-2 bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-4 border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-cinzel text-sm uppercase tracking-wider text-primary">Daily Consistency Score</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-primary">
                      {selectedLog.consistencyScore}%
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </PrimaryCard>
      </div>
    </div>
  )
}
