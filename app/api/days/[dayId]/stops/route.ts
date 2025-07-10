import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addStopSchema } from "@/lib/schemas";

// POST /api/days/[dayId]/stops - Adds a new stop to a specific day
export async function POST(request: Request, { params }: { params: { dayId: string } }) {
  try {
    const { dayId } = params;
    const body = await request.json();
    const validation = addStopSchema.safeParse(body);
    console.log("Validation: ", validation);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const day = await prisma.day.findUnique({
      where: { id: dayId },
      include: { _count: { select: { stops: true } } },
    });
    console.log("Day: ", day);
    if (!day) return NextResponse.json({ error: "Day not found" }, { status: 404 });

    const newStop = await prisma.stop.create({
      data: {
        ...validation.data,
        dayId: dayId,
        tripId: day.tripId,
        order: day._count.stops,
      },
    });

    console.log("New Stop: ", newStop);

    return NextResponse.json({ success: true, data: newStop }, { status: 201 });
  } catch (error) {
    console.error("Failed to add stop:", error);
    return NextResponse.json({ error: "Failed to add stop" }, { status: 500 });
  }
}
