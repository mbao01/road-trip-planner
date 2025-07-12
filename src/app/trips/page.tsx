import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getTripsByUserId } from "@/services/trip"
import { Button } from "@/components/ui/button"
import { TripsTable } from "@/components/trips-table"
import { CreateTripModal } from "@/components/create-trip-modal"

export default async function TripsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const trips = await getTripsByUserId(session.user.id)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <CreateTripModal>
          <Button>Create Trip</Button>
        </CreateTripModal>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <TripsTable trips={trips} />
      </main>
    </div>
  )
}
