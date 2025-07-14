import { NextRequest, NextResponse } from "next/server";
import { travelService } from "@/services/travel";
import { StatusCodes } from "http-status-codes";

/**
 * GET /api/trips/[tripId]/travel
 * @returns The trip travel
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const { travel } = await travelService.getTravel({ tripId });
    if (!travel) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json({ travel });
  } catch (error) {
    console.error(`Failed to retrieve travel for trip ${tripId}:`, error);
    return NextResponse.json(
      { error: "Failed to retrieve travel data" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT /api/trips/[tripId]/travel
 * @returns The updated trip travel
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const { travel } = await travelService.createTravel({ tripId });
    return NextResponse.json({ data: travel });
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 });
  }
}
