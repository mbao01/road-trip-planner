import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trips/[tripId]/stops - Assembles and returns all stops in the trip
export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const { tripId } = params;
  try {
    const stops = await prisma.stop.findMany({
      where: {
        tripId: tripId,
      },
      include: {
        travel: true,
      },
    });

    if (!stops) {
      return NextResponse.json({ error: "Stops not found" }, { status: 404 });
    }

    return NextResponse.json({ stops });
  } catch (error) {
    console.error(`Failed to retrieve stops for trip ${tripId}:`, error);
    return NextResponse.json(
      { error: "Failed to retrieve stops" },
      { status: 500 }
    );
  }
}
