import { redirect } from "next/navigation";
import { TripPlannerClient } from "@/components/trip-planner-client";
import { auth } from "@/lib/auth";
import { tripService } from "@/services/trip";

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const session = await auth();
  const { tripId } = await params;

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { trip } = await tripService.getUserTrip({ tripId });

  return (
    <div className="min-h-screen bg-background">
      <TripPlannerClient trip={trip} />
    </div>
  );
}
