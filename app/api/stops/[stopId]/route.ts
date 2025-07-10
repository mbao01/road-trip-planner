import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/stops/[stopId] - Deletes a single stop
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ stopId: string }> }
) {
  const { stopId } = await params;

  try {
    await prisma.stop.delete({ where: { id: stopId } }); // Add access control
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete stop ${stopId}:`, error);
    return NextResponse.json({ error: "Failed to delete stop" }, { status: 500 });
  }
}
