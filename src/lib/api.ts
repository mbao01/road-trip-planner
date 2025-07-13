import { DayWithStops } from "@/types/trip";
import { Day, Settings, Stop, Travel, Trip, TripAccess } from "@prisma/client";

export type TripWithSettings = Trip & {
  travel: Travel;
  access: TripAccess;
  settings: Settings;
  days: DayWithStops[];
};

export async function fetchTrip(tripId: string): Promise<TripWithSettings> {
  const res = await fetch(`/api/trips/${tripId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchDays(tripId: string): Promise<DayWithStops[]> {
  const res = await fetch(`/api/trips/${tripId}/days`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchStops(tripId: string): Promise<Stop[]> {
  const res = await fetch(`/api/trips/${tripId}/stops`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTrip(
  tripId: string,
  data: Partial<{ startDate: Date; endDate: Date; days: DayWithStops[] }>
): Promise<Trip & { days: DayWithStops[] }> {
  const res = await fetch(`/api/trips/${tripId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTripDetails(tripId: string, data: { name?: string }): Promise<Trip> {
  const res = await fetch(`/api/trips/${tripId}/details`, {
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

export async function deleteTrip(tripId: Trip["id"]): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
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
  startStop: Partial<Stop>;
}): Promise<Trip> {
  const res = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getTripTravel(tripId: string): Promise<Trip> {
  const res = await fetch(`/api/trips/${tripId}/travel`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  const result = await res.json();
  return result.data;
}

export async function updateTripTravel(tripId: string): Promise<Travel> {
  const res = await fetch(`/api/trips/${tripId}/travel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  const result = await res.json();
  return result.data;
}
