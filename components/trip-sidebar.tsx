"use client"
import type React from "react"
import { useState, type FC } from "react"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { StopCard } from "./stop-card"
import { DayCard } from "./day-card"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import type { PlaceDetails } from "@/lib/google-maps-api"
import type { Day, Stop, Settings } from "@/types/trip"
import type { TripWithSettings } from "@/lib/api"
import * as api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { parse, format, addDays } from "date-fns"

// --------------- Helper Functions ---------------
const CURRENCY_SYMBOLS: Record<Settings["currency"], string> = { gbp: "£", eur: "€", usd: "$" }

function getMockDrivingDetails(fromStopName: string, toStopName: string, settings: Settings): string {
  const hash = (str: string) => {
    let h = 0
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
    return h
  }
  const combinedHash = Math.abs(hash(fromStopName + toStopName))
  let baseMiles = (combinedHash % 80) + 10 + (combinedHash % 100) / 100
  if (settings.avoidMotorways) baseMiles *= 1.15
  if (settings.avoidTolls) baseMiles *= 1.05
  const distance = settings.distanceUnit === "km" ? baseMiles * 1.60934 : baseMiles
  let minutes = Math.floor(baseMiles * 1.5) + (combinedHash % 15)
  if (settings.avoidMotorways) minutes += 15
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  let timeString = ""
  if (hours > 0) timeString += `${hours} hr `
  timeString += `${remainingMinutes} min`
  let costString = ""
  if (settings.calculateCosts) {
    const GALLONS_PER_LITRE = 0.219969
    const cost = (baseMiles / settings.mpg) * (settings.fuelCostPerLitre / GALLONS_PER_LITRE)
    costString = ` (${CURRENCY_SYMBOLS[settings.currency]}${cost.toFixed(2)})`
  }
  return `Drive ${distance.toFixed(1)} ${settings.distanceUnit}${costString}, ${timeString.trim()}`
}

function recalculateDrivingDetails(trip: TripWithSettings): TripWithSettings {
  const newTrip = structuredClone(trip)
  let previousStop: Stop | null = null
  for (const day of newTrip.days) {
    for (const stop of day.stops) {
      if (previousStop === null) stop.driving = ""
      else stop.driving = getMockDrivingDetails(previousStop.name, stop.name, newTrip.settings)
      previousStop = stop
    }
  }
  return newTrip
}

// --------------- Component ---------------
interface TripSidebarProps {
  trip: TripWithSettings
  setTripData: React.Dispatch<React.SetStateAction<TripWithSettings | null>>
}

export const TripSidebar: FC<TripSidebarProps> = ({ trip, setTripData }) => {
  const [activeStop, setActiveStop] = useState<Stop | null>(null)
  const [dayToDelete, setDayToDelete] = useState<Day | null>(null)
  const { toast } = useToast()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleAction = async (
    action: () => Promise<any>,
    optimisticState: TripWithSettings,
    successMessage: string,
    failureMessage: string,
  ) => {
    const originalState = trip
    setTripData(optimisticState)
    try {
      await action()
      toast({ title: successMessage })
    } catch (error) {
      setTripData(originalState)
      console.error(error)
      toast({ variant: "destructive", title: failureMessage })
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveStop(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const srcDayId = active.data.current?.dayId
    const dstDayId = over.data.current?.day?.id || over.data.current?.dayId
    if (!srcDayId || !dstDayId) return

    const clone = structuredClone(trip)
    const srcDay = clone.days.find((d) => d.id === srcDayId)!
    const dstDay = clone.days.find((d) => d.id === dstDayId)!

    if (srcDayId === dstDayId) {
      const oldIndex = srcDay.stops.findIndex((s) => `stop-${s.id}` === active.id)
      const newIndex = String(over.id).startsWith("stop-")
        ? dstDay.stops.findIndex((s) => `stop-${s.id}` === over.id)
        : dstDay.stops.length - 1
      const [item] = srcDay.stops.splice(oldIndex, 1)
      srcDay.stops.splice(newIndex, 0, item)
    } else {
      const oldIndex = srcDay.stops.findIndex((s) => `stop-${s.id}` === active.id)
      const [moved] = srcDay.stops.splice(oldIndex, 1)
      if (String(over.id).startsWith("stop-")) {
        const newIndex = dstDay.stops.findIndex((s) => `stop-${s.id}` === over.id)
        dstDay.stops.splice(newIndex, 0, moved)
      } else {
        dstDay.stops.push(moved)
      }
    }
    const recalculatedTrip = recalculateDrivingDetails(clone)
    handleAction(
      () => api.reorderTrip(trip.id, recalculatedTrip.days),
      recalculatedTrip,
      "Trip reordered",
      "Failed to reorder",
    )
  }

  const addStop = async (dayId: number, loc: PlaceDetails) => {
    const clone = structuredClone(trip)
    const day = clone.days.find((d) => d.id === dayId)!
    const newStopData = {
      name: loc.name,
      driving: "",
      latitude: loc.latitude,
      longitude: loc.longitude,
    }
    const tempId = Date.now()
    day.stops.push({ ...newStopData, id: tempId })
    const recalculatedTrip = recalculateDrivingDetails(clone)
    setTripData(recalculatedTrip) // Optimistic update with temp ID

    try {
      const savedStop = await api.addStop(dayId, newStopData)
      // Replace temp stop with real one from server
      const finalTrip = structuredClone(recalculatedTrip)
      const finalDay = finalTrip.days.find((d) => d.id === dayId)!
      const stopIndex = finalDay.stops.findIndex((s) => s.id === tempId)
      if (stopIndex !== -1) finalDay.stops[stopIndex] = savedStop
      setTripData(recalculateDrivingDetails(finalTrip))
      toast({ title: "Stop added" })
    } catch (error) {
      setTripData(trip) // Revert
      console.error(error)
      toast({ variant: "destructive", title: "Failed to add stop" })
    }
  }

  const deleteStop = (dayId: number, stopId: number) => {
    const clone = structuredClone(trip)
    const day = clone.days.find((d) => d.id === dayId)!
    day.stops = day.stops.filter((s) => s.id !== stopId)
    const recalculatedTrip = recalculateDrivingDetails(clone)
    handleAction(() => api.deleteStop(stopId), recalculatedTrip, "Stop deleted", "Failed to delete stop")
  }

  const confirmDeleteDay = () => {
    if (!dayToDelete) return
    const clone = structuredClone(trip)
    clone.days = clone.days.filter((d) => d.id !== dayToDelete.id)
    const recalculatedTrip = recalculateDrivingDetails(clone)
    handleAction(() => api.deleteDay(dayToDelete.id), recalculatedTrip, "Day deleted", "Failed to delete day")
    setDayToDelete(null)
  }

  const moveDay = (dayId: number, direction: "up" | "down") => {
    const clone = structuredClone(trip)
    const index = clone.days.findIndex((d) => d.id === dayId)
    if (index === -1) return

    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= clone.days.length) return // Swap the days in the array
    ;[clone.days[index], clone.days[swapIndex]] = [clone.days[swapIndex], clone.days[index]]

    // Recalculate dates for all days based on the new order
    const [startStr] = clone.dates.split(" - ")
    const startDate = parse(startStr, "dd/MM/yyyy", new Date())
    clone.days.forEach((day, i) => {
      day.date = format(addDays(startDate, i), "EEE, d MMM")
    })

    const recalculatedTrip = recalculateDrivingDetails(clone)
    handleAction(
      () => api.reorderTrip(trip.id, recalculatedTrip.days),
      recalculatedTrip,
      "Day moved",
      "Failed to move day",
    )
  }

  let stopCounter = 0
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={(e) => e.active.data.current?.type === "stop" && setActiveStop(e.active.data.current.stop)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {trip.days.map((day, i) => {
            const offset = stopCounter
            stopCounter += day.stops.length
            return (
              <DayCard
                key={day.id}
                day={day}
                dayIndex={i}
                totalDays={trip.days.length}
                stopNumberOffset={offset}
                onMoveDay={moveDay}
                onDeleteDay={() => setDayToDelete(day)}
                onAddStop={addStop}
                onDeleteStop={deleteStop}
                settings={trip.settings}
              />
            )
          })}
        </div>
        <DragOverlay>
          {activeStop && (
            <StopCard stop={activeStop} dayId={0} stopNumber={0} onDeleteStop={() => {}} isFirstStopOfTrip={false} />
          )}
        </DragOverlay>
      </DndContext>
      {dayToDelete && (
        <DeleteConfirmationDialog
          open
          onOpenChange={() => setDayToDelete(null)}
          onConfirm={confirmDeleteDay}
          dayNumber={trip.days.findIndex((d) => d.id === dayToDelete.id) + 1}
        />
      )}
    </>
  )
}
