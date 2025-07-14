import { NextRequest, NextResponse } from "next/server";
import { dayService } from "@/services/day";

/**
 * GET /api/trips/[tripId]/days
 * @returns All days in the trip
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const days = await dayService.getDays({ tripId });
    if (!days) {
      return NextResponse.json({ error: "Days not found" }, { status: 404 });
    }
    return NextResponse.json({ days });
  } catch (error) {
    console.error(`Failed to retrieve days for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve days" }, { status: 500 });
  }
}
