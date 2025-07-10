import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trips/[tripId]/stops - Assembles and returns all stops in the trip
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const days = await prisma.day.findMany({
      where: {
        tripId: tripId,
      },
      orderBy: { date: "asc" },
      include: {
        stops: {
          orderBy: { order: "asc" },
        },
      },
    });

    const stops = days?.flatMap((day) => day.stops);

    if (!stops) {
      return NextResponse.json({ error: "Stops not found" }, { status: 404 });
    }

    return NextResponse.json({ stops });
  } catch (error) {
    console.error(`Failed to retrieve stops for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve stops" }, { status: 500 });
  }
}
