import type { Trip, Settings, Day, Stop } from "@/types/trip"
import type { DateRange } from "react-day-picker"
import type { PlaceDetails } from "./google-maps-api"

export type TripWithSettings = Trip & {
  settings: Settings
  access: "Owner" | "Editor" | "Viewer" | "Public"
}

export async function fetchTrip(tripId: string): Promise<TripWithSettings> {
  const res = await fetch(`/api/trip/${tripId}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateTripDetails(tripId: string, data: { name?: string; dates?: string }): Promise<Trip> {
  const res = await fetch(`/api/trip/${tripId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateSettings(tripId: string, settings: Omit<Settings, "id" | "tripId">): Promise<Settings> {
  const res = await fetch(`/api/trip/${tripId}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function addStop(dayId: number, stopData: Omit<Stop, "id">): Promise<Stop> {
  const res = await fetch(`/api/days/${dayId}/stops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stopData),
  })
  if (!res.ok) throw new Error(await res.text())
  const result = await res.json()
  return result.data
}

export async function deleteStop(stopId: number): Promise<void> {
  const res = await fetch(`/api/stops/${stopId}`, { method: "DELETE" })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteDay(dayId: number): Promise<void> {
  const res = await fetch(`/api/days/${dayId}`, { method: "DELETE" })
  if (!res.ok) throw new Error(await res.text())
}

export async function reorderTrip(tripId: string, days: Day[]): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(days),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function createTrip(data: {
  name: string
  dates: DateRange
  startStop: PlaceDetails
}): Promise<{ tripId: string }> {
  const res = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
