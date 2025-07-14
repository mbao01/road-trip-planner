import { UpdateTripDetailsArg } from "@/app/api/utilities/validation/schemas/trip";
import { CollaboratorWithUser, DayWithStops, UserTrip } from "@/types/trip";
import { Collaborator, Day, Settings, Stop, Travel, Trip } from "@prisma/client";

export async function fetchTrip(tripId: string): Promise<UserTrip> {
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

export async function fetchCollaborators(tripId: string): Promise<CollaboratorWithUser[]> {
  const res = await fetch(`/api/trips/${tripId}/collaborators`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchCollaborator(
  tripId: string,
  collaboratorId: string
): Promise<CollaboratorWithUser> {
  const res = await fetch(`/api/trips/${tripId}/collaborators/${collaboratorId}`);
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

export async function updateTripDetails(tripId: string, data: UpdateTripDetailsArg): Promise<Trip> {
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

export async function updateCollaborator(
  tripId: string,
  collaboratorId: string,
  data: Pick<Collaborator, "tripRole">
): Promise<Collaborator> {
  const res = await fetch(`/api/trips/${tripId}/collaborators/${collaboratorId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addStop(
  tripId: Trip["id"],
  dayId: Day["id"],
  stopData: Omit<Stop, "id">
): Promise<Stop> {
  const res = await fetch(`/api/trips/${tripId}/days/${dayId}/stops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stopData),
  });
  if (!res.ok) throw new Error(await res.text());
  const result = await res.json();
  return result.data;
}

export async function addCollaborator(tripId: string, data: Collaborator): Promise<Collaborator> {
  const res = await fetch(`/api/trips/${tripId}/collaborators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteStop(tripId: Trip["id"], stopId: Stop["id"]): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}/stops/${stopId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteDay(tripId: Trip["id"], dayId: Day["id"]): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}/days/${dayId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteTrip(tripId: Trip["id"]): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export async function removeCollaborator(tripId: string, collaboratorId: string): Promise<void> {
  const res = await fetch(`/api/trips/${tripId}/collaborators/${collaboratorId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function reorderTrip(tripId: string, trip: UserTrip): Promise<void> {
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
