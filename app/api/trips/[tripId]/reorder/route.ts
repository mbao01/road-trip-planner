import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { reorderDaysSchema } from "@/app/api/utilities/validation/schemas";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[tripId]/reorder - Handles reordering of days and stops
export async function PUT(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const body = await request.json();
    const result = validator(body, reorderDaysSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    const updatedDays = result.data;

    const transaction = updatedDays.flatMap((day, dayIndex) => {
      const dayUpdate = prisma.day.update({
        where: { id: day.id },
        data: { order: dayIndex, date: day.date },
      });
      const stopUpdates = day.stops.map((stop, stopIndex) =>
        prisma.stop.update({
          where: { id: stop.id },
          data: { order: stopIndex, dayId: day.id },
        })
      );
      return [dayUpdate, ...stopUpdates];
    });

    await prisma.$transaction(transaction);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to reorder trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to reorder trip" }, { status: 500 });
  }
}
