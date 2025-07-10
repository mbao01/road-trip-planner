import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTripSchema } from "@/lib/schemas";

const MOCK_USER_ID = "1"; // Hardcoded user

// GET /api/trips/[tripId] - Assembles and returns the full trip object
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [{ ownerId: MOCK_USER_ID }, { collaborators: { some: { userId: MOCK_USER_ID } } }],
      },
      include: {
        days: {
          orderBy: { date: "asc" },
          include: {
            stops: {
              orderBy: { order: "asc" },
            },
          },
        },
        travel: true,
        settings: true,
        collaborators: { where: { userId: MOCK_USER_ID } },
        _count: { select: { stops: true } },
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    if (!trip.travel && trip._count.stops > 1) {
      try {
        const url = new URL(`/api/trips/${tripId}/travel`, request.nextUrl.origin);
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        const { data: travel } = await res.json();
        trip.travel = travel;
      } catch (error) {
        console.error(`Failed to retrieve travel for trip ${tripId}:`, error);
      }
    }

    let access: "Owner" | "Editor" | "Viewer" = "Owner";
    if (trip.ownerId !== MOCK_USER_ID) {
      const role = trip.collaborators[0]?.role;
      if (role === "EDITOR") access = "Editor";
      if (role === "VIEWER") access = "Viewer";
    }

    const { collaborators, ...tripData } = trip;
    return NextResponse.json({ ...tripData, access });
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 });
  }
}

// PUT /api/trips/[tripId] - Updates only the top-level trip properties (name, dates)
export async function PUT(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const body = await request.json();
    const validation = updateTripSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId }, // In a real app, add access control check here
      data: validation.data,
    });

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}
