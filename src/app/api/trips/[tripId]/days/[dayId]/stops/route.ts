import { NextResponse } from "next/server";
import { dayService } from "@/services/day";

/**
 * POST /api/trips/[tripId]/days/[dayId]/stops
 * @returns Adds a new stop to a specific day
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ dayId: string; tripId: string }> }
) {
  const { dayId, tripId } = await params;

  try {
    const body = await request.json();

    const { stop } = await dayService.createDayStop({ dayId, tripId }, body);

    return NextResponse.json({ success: true, data: stop }, { status: 201 });
  } catch (error) {
    console.error("Failed to add stop:", error);
    return NextResponse.json({ error: "Failed to add stop" }, { status: 500 });
  }
}
