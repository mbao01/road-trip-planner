import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/days/[dayId] - Deletes a day and all its associated stops
export async function DELETE(request: Request, { params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;

  try {
    // Prisma's cascading delete on the schema will handle deleting the stops
    await prisma.day.delete({ where: { id: dayId } }); // Add access control
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete day ${dayId}:`, error);
    return NextResponse.json({ error: "Failed to delete day" }, { status: 500 });
  }
}
