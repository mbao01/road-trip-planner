import { redirect } from "next/navigation";
import { CreateTripModal } from "@/components/create-trip-modal";
import { TripsTable } from "@/components/trips-table";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { UserDropdown } from "@/components/user-dropdown";
import { auth } from "@/lib/auth";
import { tripService } from "@/services/trip";

export default async function TripsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { trips } = (await tripService.getUserTrips()) ?? [];

  return (
    <>
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center gap-2 mb-8">
            <h1 className="text-3xl font-bold">My Trips</h1>
            <div className="flex items-center gap-2">
              <CreateTripModal
                trigger={
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Create Trip
                  </Button>
                }
              />
              <UserDropdown />
            </div>
          </div>
          <TripsTable initialTrips={trips} />
        </div>
      </div>
      <Toaster />
    </>
  );
}
