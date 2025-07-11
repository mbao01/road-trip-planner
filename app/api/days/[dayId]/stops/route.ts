import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { addStopSchema } from "@/app/api/utilities/validation/schemas";
import { prisma } from "@/lib/prisma";

// POST /api/days/[dayId]/stops - Adds a new stop to a specific day
export async function POST(request: Request, { params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  try {
    const body = await request.json();
    const result = validator(body, addStopSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const day = await prisma.day.findUnique({
      where: { id: dayId },
      include: { _count: { select: { stops: true } } },
    });
    if (!day) return NextResponse.json({ error: "Day not found" }, { status: 404 });

    const newStop = await prisma.stop.create({
      data: {
        ...result.data,
        dayId: dayId,
        tripId: day.tripId,
        order: day._count.stops,
      },
    });

    return NextResponse.json({ success: true, data: newStop }, { status: 201 });
  } catch (error) {
    console.error("Failed to add stop:", error);
    return NextResponse.json({ error: "Failed to add stop" }, { status: 500 });
  }
}
