import { NextRequest, NextResponse } from "next/server";
import { stopService } from "@/services/stop";

/**
 * PUT /api/trips/[tripId]/stops/[stopId]
 * @returns Deletes a single stop
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string; tripId: string }> }
) {
  const { stopId, tripId } = await params;

  try {
    const body = await req.json();

    await stopService.updateStop({ stopId, tripId }, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to update stop ${stopId}:`, error);
    return NextResponse.json({ error: "Failed to update stop" }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/[tripId]/stops/[stopId]
 * @returns Deletes a single stop
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ stopId: string; tripId: string }> }
) {
  const { stopId, tripId } = await params;

  try {
    await stopService.deleteStop({ stopId, tripId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete stop ${stopId}:`, error);
    return NextResponse.json({ error: "Failed to delete stop" }, { status: 500 });
  }
}
