"use client";

// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
// import { getTripsByUserId } from "@/services/trip";
import type { TripTableRow } from "@/types/trip";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateTripModal } from "@/components/create-trip-modal";
import { TripsTable } from "@/components/trips-table";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { UserDropdown } from "@/components/user-dropdown";

async function getTrips(): Promise<TripTableRow[]> {
  const res = await fetch("/api/trips", { cache: "no-store" });
  if (!res.ok) {
    console.error(await res.text());
    return [];
  }
  return res.json();
}

export default function TripsPage() {
  const [trips, setTrips] = useState<TripTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .finally(() => setIsLoading(false));
  }, []);

  const onTripCreated = (tripId: string) => {
    setCreateModalOpen(false);
    router.push(`/trips/${tripId}`);
  };

  return (
    <>
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center gap-2 mb-8">
            <h1 className="text-3xl font-bold">My Trips</h1>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Create Trip
              </Button>
              <UserDropdown />
            </div>
          </div>
          {isLoading ? <p>Loading trips...</p> : <TripsTable initialTrips={trips} />}
        </div>
      </div>
      <CreateTripModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        onTripCreated={onTripCreated}
      />
      <Toaster />
    </>
  );
}

// export default async function TripsPage() {
//   const session = await auth();

//   if (!session?.user?.id) {
//     redirect("/auth/signin");
//   }

//   const trips = await getTripsByUserId(session.user.id);

//   return (
//     <div className="flex min-h-screen w-full flex-col">
//       <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
//         <h1 className="text-2xl font-bold">My Trips</h1>
//         <CreateTripModal>
//           <Button>Create Trip</Button>
//         </CreateTripModal>
//       </header>
//       <main className="flex-1 p-4 md:p-6">
//         <TripsTable trips={trips} />
//       </main>
//     </div>
//   );
// }
