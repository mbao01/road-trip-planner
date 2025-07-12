import { TripPlanner } from "@/components/trip-planner";

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <TripPlanner tripId={tripId} />
    </div>
  );
}
