import { NextRequest, NextResponse } from "next/server";
import { tripService } from "@/services/trip";

/**
 * PUT /api/trips/[tripId]/details
 * Updates only the top-level trip properties (name, status, access)
 * @returns The updated trip
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const body = await req.json();

    const { trip } = await tripService.updateTripDetails({ tripId }, body);

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}
