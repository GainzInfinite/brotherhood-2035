"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addDays, 
  eachDayOfInterval,
  isWithinInterval,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  setMonth,
  setYear,
  getYear,
  addYears,
  subYears
} from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export type CalendarMode = "single" | "range" | "month" | "multi-day"

export interface CalendarMarker {
  date: Date
  color: string // tailwind class for bg color
  tooltip?: string
}

interface UnifiedCalendarProps {
  mode?: CalendarMode
  selected?: Date | Date[] | { from: Date; to: Date } | null
  onSelect?: (date: any) => void
  className?: string
  showOutsideDays?: boolean
  markers?: CalendarMarker[]
}

export function UnifiedCalendar({
  mode = "single",
  selected,
  onSelect,
  className,
  showOutsideDays = true,
  markers = [],
}: UnifiedCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">(mode === "month" ? "months" : "days")

  // Handle view mode changes based on prop mode
  React.useEffect(() => {
    if (mode === "month") setViewMode("months")
  }, [mode])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextYear = () => setCurrentMonth(addYears(currentMonth, 1))
  const prevYear = () => setCurrentMonth(subYears(currentMonth, 1))

  const handleDateClick = (day: Date) => {
    if (mode === "single") {
      onSelect?.(day)
    } else if (mode === "range") {
      const range = selected as { from: Date; to: Date } | null
      if (range?.from && !range.to && day > range.from) {
        onSelect?.({ from: range.from, to: day })
      } else {
        onSelect?.({ from: day, to: undefined })
      }
    } else if (mode === "multi-day") {
      const dates = (selected as Date[]) || []
      const isSelected = dates.some(d => isSameDay(d, day))
      if (isSelected) {
        onSelect?.(dates.filter(d => !isSameDay(d, day)))
      } else {
        onSelect?.([...dates, day])
      }
    }
  }

  const handleMonthClick = (monthIndex: number) => {
    const newDate = setMonth(currentMonth, monthIndex)
    if (mode === "month") {
      onSelect?.(newDate)
    } else {
      setCurrentMonth(newDate)
      setViewMode("days")
    }
  }

  const handleYearClick = (year: number) => {
    const newDate = setYear(currentMonth, year)
    setCurrentMonth(newDate)
    setViewMode("months")
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={viewMode === "years" ? () => setCurrentMonth(subYears(currentMonth, 12)) : viewMode === "months" ? prevYear : prevMonth}
          className="h-7 w-7 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "days" ? "months" : "years")}
            className="h-7 text-sm font-semibold hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] font-heading"
          >
            {viewMode === "days" && format(currentMonth, "MMMM yyyy")}
            {viewMode === "months" && format(currentMonth, "yyyy")}
            {viewMode === "years" && `${getYear(currentMonth) - 6} - ${getYear(currentMonth) + 5}`}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={viewMode === "years" ? () => setCurrentMonth(addYears(currentMonth, 12)) : viewMode === "months" ? nextYear : nextMonth}
          className="h-7 w-7 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "d"
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        
        let isSelected = false
        let isRangeStart = false
        let isRangeEnd = false
        let isInRange = false

        if (mode === "single") {
          isSelected = selected ? isSameDay(day, selected as Date) : false
        } else if (mode === "range") {
          const range = selected as { from: Date; to: Date } | null
          if (range?.from) {
            isRangeStart = isSameDay(day, range.from)
            if (range.to) {
              isRangeEnd = isSameDay(day, range.to)
              isInRange = isWithinInterval(day, { start: range.from, end: range.to })
            }
          }
        } else if (mode === "multi-day") {
          isSelected = ((selected as Date[]) || []).some(d => isSameDay(d, day))
        }

        const isOutside = !isSameMonth(day, monthStart)
        const isTodayDate = isToday(day)
        
        // Find markers for this day
        const dayMarkers = markers.filter(m => isSameDay(m.date, day))

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
              isInRange && "bg-[#D4AF37]/10 first:rounded-l-md last:rounded-r-md"
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all duration-200 relative",
                (isSelected || isRangeStart || isRangeEnd) && "bg-[#D4AF37] text-black hover:bg-[#C5A028] hover:text-black shadow-lg shadow-gold-500/40 ring-2 ring-[#D4AF37]/70 font-bold",
                isTodayDate && !isSelected && !isRangeStart && !isRangeEnd && "ring-2 ring-[#D4AF37]/60 text-[#D4AF37] font-bold shadow-md shadow-gold-500/30",
                isOutside && "text-muted-foreground opacity-50",
                !isOutside && !isTodayDate && "text-foreground"
              )}
              onClick={() => handleDateClick(cloneDay)}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>{formattedDate}</time>
              
              {/* Markers */}
              {dayMarkers.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {dayMarkers.slice(0, 3).map((marker, i) => (
                    <div 
                      key={i} 
                      className={cn("w-1 h-1 rounded-full", marker.color)} 
                      title={marker.tooltip}
                    />
                  ))}
                </div>
              )}
            </Button>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 mt-3 w-full">
          {days}
        </div>
      )
      days = []
    }

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-[0.8rem] font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        {rows}
      </div>
    )
  }

  const renderMonths = () => {
    const months = eachMonthOfInterval({
      start: startOfYear(currentMonth),
      end: endOfYear(currentMonth)
    })

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {months.map((month, index) => {
          const isSelected = mode === "month" && selected && isSameMonth(month, selected as Date)
          return (
            <Button
              key={month.toString()}
              variant="ghost"
              onClick={() => handleMonthClick(index)}
              className={cn(
                "h-10 w-full font-normal hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]",
                isSelected && "bg-[#D4AF37] text-black hover:bg-[#C5A028] hover:text-black shadow-lg ring-2 ring-[#D4AF37]/50"
              )}
            >
              {format(month, "MMM")}
            </Button>
          )
        })}
      </div>
    )
  }

  const renderYears = () => {
    const currentYear = getYear(currentMonth)
    const years = Array.from({ length: 12 }, (_, i) => currentYear - 6 + i)

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {years.map((year) => (
          <Button
            key={year}
            variant="ghost"
            onClick={() => handleYearClick(year)}
            className={cn(
              "h-10 w-full font-normal hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]",
              year === currentYear && "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 ring-2 ring-[#D4AF37]"
            )}
          >
            {year}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("p-3 bg-card border-2 border-[#D4AF37]/20 rounded-xl shadow-xl w-full max-w-[320px]", className)}>
      {renderHeader()}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "days" && renderDays()}
          {viewMode === "months" && renderMonths()}
          {viewMode === "years" && renderYears()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
