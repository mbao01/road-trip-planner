import { NextResponse } from "next/server";
import { tripService } from "@/services/trip";

/**
 * PUT /api/trips/[tripId]/reorder
 * @returns The updated trip
 */
export async function PUT(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const body = await req.json();

    await tripService.reorderTrip({ tripId }, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to reorder trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to reorder trip" }, { status: 500 });
  }
}
