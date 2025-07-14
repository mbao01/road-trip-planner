import { NextRequest, NextResponse } from "next/server";
import { tripService } from "@/services/trip";

/**
 * GET /api/trips/[tripId]
 * @returns The full trip object
 */
export const GET = async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

  try {
    const { trip } = await tripService.getUserTrip({ tripId });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
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

  try {
    const body = await req.json();

    const { trip } = await tripService.updateTrip({ tripId }, body);
    return NextResponse.json(trip);
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

  try {
    await tripService.deleteTrip({ tripId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
};
