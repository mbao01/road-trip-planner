import { NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { addStopSchema } from "@/app/api/utilities/validation/schemas";
import { addStopToDay } from "@/services/day";
import { TripRole } from "@prisma/client";

/**
 * POST /api/trips/[tripId]/days/[dayId]/stops
 * @returns Adds a new stop to a specific day
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ dayId: string; tripId: string }> }
) {
  const { dayId, tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    const body = await request.json();
    const result = validator(body, addStopSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    try {
      const newStop = await addStopToDay(dayId, result.data);
      return NextResponse.json({ success: true, data: newStop }, { status: 201 });
    } catch (error) {
      if (error?.message === "Day not found") {
        return NextResponse.json({ error: "Day not found" }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to add stop:", error);
    return NextResponse.json({ error: "Failed to add stop" }, { status: 500 });
  }
}
