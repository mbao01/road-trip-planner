import { NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { getStopsForTrip } from "@/services/stop";
import { TripRole } from "@prisma/client";

/**
 * GET /api/trips/[tripId]/stops
 * @returns All stops in the trip
 */
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  try {
    const stops = await getStopsForTrip(tripId);
    if (!stops) {
      return NextResponse.json({ error: "Stops not found" }, { status: 404 });
    }
    return NextResponse.json({ stops });
  } catch (error) {
    console.error(`Failed to retrieve stops for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve stops" }, { status: 500 });
  }
}
