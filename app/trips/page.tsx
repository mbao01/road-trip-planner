"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TripsTable } from "@/components/trips-table"
import { CreateTripModal } from "@/components/create-trip-modal"
import { Toaster } from "@/components/ui/toaster"
import type { TripTableRow } from "@/types/trip"

async function getTrips(): Promise<TripTableRow[]> {
  const res = await fetch("/api/trips", { cache: "no-store" })
  if (!res.ok) {
    console.error(await res.text())
    return []
  }
  return res.json()
}

export default function TripsPage() {
  const [trips, setTrips] = useState<TripTableRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .finally(() => setIsLoading(false))
  }, [])

  const onTripCreated = (tripId: string) => {
    setCreateModalOpen(false)
    router.push(`/trips/${tripId}`);
  }

  return (
    <>
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Trips</h1>
            <Button onClick={() => setCreateModalOpen(true)} className="bg-orange-500 hover:bg-orange-600">
              Create New Trip
            </Button>
          </div>
          {isLoading ? <p>Loading trips...</p> : <TripsTable initialTrips={trips} />}
        </div>
      </div>
      <CreateTripModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} onTripCreated={onTripCreated} />
      <Toaster />
    </>
  )
}
