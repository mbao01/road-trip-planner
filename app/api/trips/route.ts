import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { createTripSchema } from "@/app/api/utilities/validation/schemas";
import { getUserTrips, createTripWithDaysAndStartStop } from "@/services/trip";

// A hardcoded user for demonstration purposes.
// In a real app, this would come from an authentication session.
const MOCK_USER_ID = "1";

// GET /api/trips - Fetches all trips for the current user (owned or collaborated on)
export async function GET() {
  try {
    const tripsWithDetails = await getUserTrips(MOCK_USER_ID);
    return NextResponse.json(tripsWithDetails);
  } catch (error) {
    console.error("Failed to retrieve trips:", error);
    return NextResponse.json({ error: "Failed to retrieve trips" }, { status: 500 });
  }
}

// POST /api/trips - Creates a new trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validator(body, createTripSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    const { name, startDate, endDate, startStop } = result.data;
    const { tripId } = await createTripWithDaysAndStartStop({
      name,
      startDate,
      endDate,
      ownerId: MOCK_USER_ID,
      startStop,
    });
    return NextResponse.json({ success: true, tripId }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
