import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trips/[tripId]/days - Assembles and returns all days in the trip
export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const { tripId } = params;
  try {
    const days = await prisma.day.findMany({
      where: {
        tripId: tripId,
      },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: { travel: true },
        },
      },
    });

    if (!days) {
      return NextResponse.json({ error: "Days not found" }, { status: 404 });
    }

    return NextResponse.json({ days });
  } catch (error) {
    console.error(`Failed to retrieve days for trip ${tripId}:`, error);
    return NextResponse.json(
      { error: "Failed to retrieve days" },
      { status: 500 }
    );
  }
}
