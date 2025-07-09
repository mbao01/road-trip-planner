"use client"
import { TripPlannerClient } from "./trip-planner-client"

// This component now simply passes the tripId to the client component.
export function TripPlanner({ tripId }: { tripId: string }) {
  return <TripPlannerClient initialTripData={null} tripId={tripId} />
}
