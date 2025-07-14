import { NextRequest, NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { dayRepo } from "@/repository/day";
import { travelRepo } from "@/repository/travel";
import { TripRole } from "@prisma/client";

/**
 * GET /api/trips/[tripId]/travel
 * @returns The trip travel
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  try {
    const travel = await travelRepo.getTravel(tripId);

    if (!travel) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    return NextResponse.json({ travel });
  } catch (error) {
    console.error(`Failed to retrieve travel for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve travel data" }, { status: 500 });
  }
}

/**
 * PUT /api/trips/[tripId]/travel
 * @returns The updated trip travel
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    const days = await dayRepo.getDaysByTripId(tripId);

    if (!days) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    // TODO:: Add support for caching such that only places without a route matrix are fetched

    const stops = days.flatMap((day) => day.stops);
    const places = stops.map((stop) => stop.placeId);

    if (places.length === 0) {
      return NextResponse.json({ data: {} });
    }

    const url = new URL(`/api/routes/matrix`, req.nextUrl.origin);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origins: places,
        destinations: places,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get distance matrix");
    }

    const matrix = await response.json();

    if (matrix && matrix.length > 0) {
      const travel = await travelRepo.updateTravel(tripId, matrix, stops);

      return NextResponse.json({ data: travel });
    }

    return NextResponse.json({ data: {} });
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 });
  }
}
