import { NextRequest, NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { updateTripSchema } from "@/app/api/utilities/validation/schemas";
import { tripRepo } from "@/repository/trip";
import { TripRole } from "@prisma/client";
import { Resource, resourceGuard } from "../../utilities/guards";

/**
 * GET /api/trips/[tripId]
 * @returns The full trip object
 */
export const GET = async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  try {
    const trip = await tripRepo.getUserTrip(session.user.id, tripId);

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    if (!trip.travel && trip._count.stops > 1) {
      try {
        const url = new URL(`/api/trips/${tripId}/travel`, req.nextUrl.origin);
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        const { data: travel } = await res.json();
        trip.travel = travel;
      } catch (error) {
        console.error(`Failed to retrieve travel for trip ${tripId}:`, error);
      }
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 });
  }
};

/**
 * PUT /api/trips/[tripId]
 * @returns The updated trip
 */
export const PUT = async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    const body = await req.json();
    const result = validator(body, updateTripSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedTrip = await tripRepo.updateTripWithDays(tripId, result.data);
    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
};

/**
 * DELETE /api/trips/[tripId]
 * @returns The deleted trip
 */
export const DELETE = async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  try {
    await tripRepo.deleteTrip(session.user.id, tripId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
};
