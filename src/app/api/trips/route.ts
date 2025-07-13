import { NextRequest, NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { createTripSchema } from "@/app/api/utilities/validation/schemas";
import { createTrip, getUserTrips } from "@/services/trip";
import { authGuard } from "../utilities/guards";

/**
 * GET /api/trips
 * @returns An array of trips owned by the current user
 */
export const GET = async function GET(req: NextRequest) {
  const session = await authGuard();

  try {
    const userTrips = await getUserTrips(session.user.id);
    return NextResponse.json(userTrips);
  } catch (error) {
    console.error("Failed to retrieve trips:", error);
    return NextResponse.json({ error: "Failed to retrieve trips" }, { status: 500 });
  }
};

/**
 * POST /api/trips
 * @returns The created trip
 */
export const POST = async function POST(req: NextRequest) {
  const session = await authGuard();

  try {
    const body = await req.json();
    const result = validator(body, createTripSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    const { name, startDate, endDate, startStop } = result.data;
    const trip = await createTrip({
      name,
      startDate,
      endDate,
      ownerId: session.user.id,
      startStop,
    });
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("Failed to create trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
};
