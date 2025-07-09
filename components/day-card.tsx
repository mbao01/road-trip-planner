"use client"

import React, { type FC } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StopCard } from "./stop-card"
import { AddStop } from "./add-stop"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, ArrowUp, ArrowDown, Trash2 } from "lucide-react"
import type { PlaceDetails } from "@/lib/google-maps-api"
import type { Settings, Day } from "@/types/trip"

interface DayCardProps {
  day: Day
  dayIndex: number
  totalDays: number
  stopNumberOffset: number
  onMoveDay: (dayId: number, direction: "up" | "down") => void
  onDeleteDay: () => void
  onAddStop: (dayId: number, location: PlaceDetails) => void
  onDeleteStop: (dayId: number, stopId: number) => void
  settings: Settings
}

export const DayCard: FC<DayCardProps> = ({
  day,
  dayIndex,
  totalDays,
  stopNumberOffset,
  onMoveDay,
  onDeleteDay,
  onAddStop,
  onDeleteStop,
  settings,
}) => {
  const { setNodeRef } = useDroppable({
    id: `day-${day.id}`,
    data: { type: "day", day: day },
  })

  const daySummary = React.useMemo(() => {
    let totalDistance = 0
    let totalCost = 0
    let totalDurationMinutes = 0

    day.stops.forEach((stop) => {
      if (stop.driving) {
        const distanceMatch = stop.driving.match(/(\d+\.?\d*)\s*(mi|km)/)
        if (distanceMatch) totalDistance += Number.parseFloat(distanceMatch[1])

        const costMatch = stop.driving.match(/[£€$](\d+\.?\d*)/)
        if (costMatch) totalCost += Number.parseFloat(costMatch[1])

        const hoursMatch = stop.driving.match(/(\d+)\s*hr/)
        if (hoursMatch) totalDurationMinutes += Number.parseInt(hoursMatch[1], 10) * 60

        const minutesMatch = stop.driving.match(/(\d+)\s*min/)
        if (minutesMatch) totalDurationMinutes += Number.parseInt(minutesMatch[1], 10)
      }
    })

    const CURRENCY_SYMBOLS: Record<Settings["currency"], string> = { gbp: "£", eur: "€", usd: "$" }
    const currencySymbol = CURRENCY_SYMBOLS[settings.currency]

    if (totalDistance === 0 && totalCost === 0 && totalDurationMinutes === 0) {
      return `0 ${settings.distanceUnit} (${currencySymbol}0.00, 0 min)`
    }

    const hours = Math.floor(totalDurationMinutes / 60)
    const minutes = totalDurationMinutes % 60

    const parts = []
    parts.push(`${totalDistance.toFixed(1)} ${settings.distanceUnit}`)
    if (settings.calculateCosts) {
      parts.push(`(${currencySymbol}${totalCost.toFixed(2)})`)
    }

    const timeParts = []
    if (hours > 0) timeParts.push(`${hours} hr`)
    if (minutes > 0) timeParts.push(`${minutes} min`)
    if (timeParts.length > 0) {
      parts.push(timeParts.join(" "))
    } else {
      parts.push("0 min")
    }

    return parts.join(", ")
  }, [day.stops, settings])

  return (
    <Card ref={setNodeRef} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold">Day {dayIndex + 1}</h3>
          <span className="text-sm text-muted-foreground truncate">{day.date}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dayIndex > 0 && (
              <DropdownMenuItem onClick={() => onMoveDay(day.id, "up")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                <span>Move day up</span>
              </DropdownMenuItem>
            )}
            {dayIndex < totalDays - 1 && (
              <DropdownMenuItem onClick={() => onMoveDay(day.id, "down")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                <span>Move day down</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDeleteDay} className="text-red-500" disabled={totalDays <= 1}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete day</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <div className="inline-block max-w-full px-3 py-1 bg-gray-100 rounded-full text-xs text-muted-foreground truncate">
          {daySummary}
        </div>
      </div>

      <SortableContext items={day.stops.map((stop) => `stop-${stop.id}`)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {day.stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              dayId={day.id}
              stopNumber={stopNumberOffset + index + 1}
              onDeleteStop={onDeleteStop}
              isFirstStopOfTrip={dayIndex === 0 && index === 0}
            />
          ))}
        </div>
      </SortableContext>

      <div className="mt-4">
        <AddStop dayId={day.id} onAddStop={onAddStop} />
      </div>
    </Card>
  )
}
