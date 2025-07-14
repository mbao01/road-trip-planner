import { NextRequest, NextResponse } from "next/server";
import { dayService } from "@/services/day";

/**
 * DELETE /api/trips/[tripId]/days/[dayId]
 * @returns Deletes a day and all its associated stops
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string; tripId: string }> }
) {
  const { dayId, tripId } = await params;

  try {
    await dayService.deleteDay({ dayId, tripId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete day ${dayId}:`, error);
    return NextResponse.json({ error: "Failed to delete day" }, { status: 500 });
  }
}
