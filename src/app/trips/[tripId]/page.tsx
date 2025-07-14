import { redirect } from "next/navigation";
import { TripPlannerClient } from "@/components/trip-planner-client";
import * as api from "@/lib/api";
import { auth } from "@/lib/auth";

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth();
  const { tripId } = await params;

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const trip = await api.fetchTrip(tripId);

  return (
    <div className="min-h-screen bg-background">
      <TripPlannerClient trip={trip} />
    </div>
  );
}
