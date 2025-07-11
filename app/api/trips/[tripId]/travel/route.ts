import { NextRequest, NextResponse } from "next/server";
import { getRouteMatrix } from "@/lib/google-maps-api";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[tripId]/travel - Updates trip travel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  try {
    const days = await prisma.day.findMany({
      where: {
        tripId: tripId,
      },
      include: {
        stops: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!days) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    // TODO::
    // - Add support for caching such that only places without a route matrix are fetched

    const stops = days.flatMap((day) => day.stops);
    const places = stops.map((stop) => stop.placeId);

    if (places.length === 0) {
      return NextResponse.json({ data: {} });
    }

    const url = new URL(`/api/routes/matrix`, request.nextUrl.origin);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origins: places,
        destinations: places,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get distance matrix");
    }

    const matrix = await response.json();

    if (matrix && matrix.length > 0) {
      const travels = matrix.reduce((acc: any, datum: any) => {
        if (datum.originIndex !== datum.destinationIndex) {
          const { id: destinationId } = stops[datum.destinationIndex];
          const { id: originId } = stops[datum.originIndex];

          // stopId: { originId, distance, duration, etc}
          acc[destinationId] = acc[destinationId] || { relationships: {} };
          acc[destinationId] = {
            relationships: {
              ...acc[destinationId].relationships,
              [originId]: {
                originId,
                dayId: stops[datum.destinationIndex].dayId,
                distance: datum.distanceMeters,
                duration: Number(datum.duration.replace("s", "")),
                staticDuration: Number(datum.staticDuration.replace("s", "")),
                condition: datum.condition,
              },
            },
          };
        }

        return acc;
      }, {});

      stops.forEach((stop, index) => {
        const { id: stopId } = stop;
        const prevStopId = stops[index - 1]?.id;

        if (prevStopId) {
          travels[stopId] = {
            ...travels[stopId],
            details: travels[stopId]?.relationships?.[prevStopId],
          };
        }
      });

      const travel = await prisma.travel.upsert({
        where: {
          tripId,
        },
        create: {
          tripId,
          travels,
        },
        update: {
          travels,
        },
      });

      return NextResponse.json({ data: travel });
    }

    return NextResponse.json({ data: {} });
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 });
  }
}

// GET /api/trips/[tripId]/travel - Gets trip travel
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const travel = await prisma.travel.findFirst({
      where: { tripId },
    });

    if (!travel) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    return NextResponse.json({ travel });
  } catch (error) {
    console.error(`Failed to retrieve travel for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve travel data" }, { status: 500 });
  }
}
