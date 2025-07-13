import { NextRequest, NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { getTripDays } from "@/services/trip";
import { TripRole } from "@prisma/client";

/**
 * GET /api/trips/[tripId]/days
 * @returns All days in the trip
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  try {
    const days = await getTripDays(tripId);
    if (!days) {
      return NextResponse.json({ error: "Days not found" }, { status: 404 });
    }
    return NextResponse.json({ days });
  } catch (error) {
    console.error(`Failed to retrieve days for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve days" }, { status: 500 });
  }
}
