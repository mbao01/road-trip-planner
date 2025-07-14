import { NextRequest, NextResponse } from "next/server";
import { tripService } from "@/services/trip";
import { StatusCodes } from "http-status-codes";

/**
 * GET /api/trips
 * @returns An array of trips owned by the current user
 */
export const GET = async function GET() {
  try {
    const { trips } = await tripService.getUserTrips();
    return NextResponse.json(trips);
  } catch (error) {
    console.error("Failed to retrieve trips:", error);
    return NextResponse.json(
      { error: "Failed to retrieve trips" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

/**
 * POST /api/trips
 * @returns The created trip
 */
export const POST = async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trip } = await tripService.createTrip(body);
    return NextResponse.json(trip, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Failed to create trip:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
