import { NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { dayRepo } from "@/repository/day";
import { TripRole } from "@prisma/client";

/**
 * DELETE /api/trips/[tripId]/days/[dayId]
 * @returns Deletes a day and all its associated stops
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ dayId: string; tripId: string }> }
) {
  const { dayId, tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    // TODO:: confirm that prisma's cascading delete on the schema will handle deleting the stops
    await dayRepo.deleteDayById(dayId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete day ${dayId}:`, error);
    return NextResponse.json({ error: "Failed to delete day" }, { status: 500 });
  }
}
