import { NextResponse } from "next/server";
import { getStopsForTrip } from "@/services/stop";

// GET /api/trips/[tripId]/stops - Assembles and returns all stops in the trip
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
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
