import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trips/[tripId]/days - Assembles and returns all days in the trip
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

    if (!days) {
      return NextResponse.json({ error: "Days not found" }, { status: 404 });
    }

    return NextResponse.json({ days });
  } catch (error) {
    console.error(`Failed to retrieve days for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve days" }, { status: 500 });
  }
}
