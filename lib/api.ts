import type { DateRange } from "react-day-picker";
import { DayWithStopsWithTravel, StopWithTravel } from "@/types/trip";
import { Day, Role, Settings, Stop, Travel, Trip } from "@prisma/client";
import type { PlaceDetails } from "./google-maps-api";

export type TripWithSettings = Trip & {
  access: Role;
  settings: Settings;
  days: DayWithStopsWithTravel[];
};

export async function fetchTrip(tripId: string): Promise<TripWithSettings> {
  const res = await fetch(`/api/trips/${tripId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchDays(tripId: string): Promise<DayWithStopsWithTravel[]> {
  const res = await fetch(`/api/trips/${tripId}/days`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchStops(tripId: string): Promise<StopWithTravel[]> {
  const res = await fetch(`/api/trips/${tripId}/stops`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTripDetails(
  tripId: string,
  data: { name?: string; startDate?: Date; endDate?: Date }
): Promise<Trip> {
  const res = await fetch(`/api/trips/${tripId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSettings(
  tripId: string,
  settings: Omit<Settings, "id" | "tripId" | "createdAt" | "updatedAt">
): Promise<Settings> {
  const res = await fetch(`/api/trips/${tripId}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addStop(dayId: Day["id"], stopData: Omit<Stop, "id">): Promise<Stop> {
  console.log("Adding stop:", stopData);
  const res = await fetch(`/api/days/${dayId}/stops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stopData),
  });
  if (!res.ok) throw new Error(await res.text());
  const result = await res.json();
  return result.data;
}

export async function deleteStop(stopId: Stop["id"]): Promise<void> {
  const res = await fetch(`/api/stops/${stopId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteDay(dayId: Day["id"]): Promise<void> {
  const res = await fetch(`/api/days/${dayId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export async function reorderTrip(tripId: string, trip: TripWithSettings): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip.days),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function createTrip(data: {
  name: string;
  startDate: Date;
  endDate: Date;
  startStop: PlaceDetails;
}): Promise<{ tripId: string }> {
  const res = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
