"use client"
import { TripPlanner } from "@/components/trip-planner"

export default function TripPage({ params }: { params: { tripId: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <TripPlanner tripId={params.tripId} />
    </div>
  )
}
