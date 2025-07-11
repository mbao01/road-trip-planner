import { NextResponse } from "next/server";
import { getDaysForTrip } from "@/services/day";

// GET /api/trips/[tripId]/days - Assembles and returns all days in the trip
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const days = await getDaysForTrip(tripId);
    if (!days) {
      return NextResponse.json({ error: "Days not found" }, { status: 404 });
    }
    return NextResponse.json({ days });
  } catch (error) {
    console.error(`Failed to retrieve days for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve days" }, { status: 500 });
  }
}
