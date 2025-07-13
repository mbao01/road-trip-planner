import { NextRequest, NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { deleteStopById } from "@/services/stop";
import { TripRole } from "@prisma/client";

/**
 * DELETE /api/trips/[tripId]/stops/[stopId]
 * @returns Deletes a single stop
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string; tripId: string }> }
) {
  const { stopId, tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    await deleteStopById(stopId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete stop ${stopId}:`, error);
    return NextResponse.json({ error: "Failed to delete stop" }, { status: 500 });
  }
}
