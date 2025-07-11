import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { createTripSchema } from "@/app/api/utilities/validation/schemas";
import { prisma } from "@/lib/prisma";
import { Role, TripStatus } from "@prisma/client";
import { addDays, differenceInDays, isAfter, isBefore } from "date-fns";

// A hardcoded user for demonstration purposes.
// In a real app, this would come from an authentication session.
const MOCK_USER_ID = "1";

// GET /api/trips - Fetches all trips for the current user (owned or collaborated on)
export async function GET() {
  try {
    const userTrips = await prisma.trip.findMany({
      where: {
        OR: [{ ownerId: MOCK_USER_ID }, { collaborators: { some: { userId: MOCK_USER_ID } } }],
      },
      include: {
        days: { include: { stops: true } },
        collaborators: { where: { userId: MOCK_USER_ID } },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const tripsWithDetails = userTrips.map((trip) => {
      let tripStatus: TripStatus = TripStatus.NOT_STARTED;
      if (trip.status === TripStatus.ARCHIVED) {
        tripStatus = TripStatus.ARCHIVED;
      } else if (isBefore(now, trip.startDate)) {
        tripStatus = TripStatus.NOT_STARTED;
      } else if (isAfter(now, trip.endDate)) {
        tripStatus = TripStatus.COMPLETED;
      } else {
        tripStatus = TripStatus.IN_PROGRESS;
      }

      let access: Role = Role.OWNER;
      if (trip.ownerId !== MOCK_USER_ID) {
        const role = trip.collaborators[0]?.role;
        if (role === Role.EDITOR) access = Role.EDITOR;
        if (role === Role.VIEWER) access = Role.VIEWER;
      }

      return {
        id: trip.id,
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        dayCount: trip.days.length,
        stopCount: trip.days.reduce((acc, day) => acc + day.stops.length, 0),
        status: tripStatus,
        access: access,
      };
    });

    return NextResponse.json(tripsWithDetails);
  } catch (error) {
    console.error("Failed to retrieve trips:", error);
    return NextResponse.json({ error: "Failed to retrieve trips" }, { status: 500 });
  }
}

// POST /api/trips - Creates a new trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validator(body, createTripSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    const { name, startDate, endDate, startStop } = result.data;
    const dayCount = differenceInDays(endDate, startDate) + 1;

    const newTrip = await prisma.trip.create({
      data: {
        name,
        startDate,
        endDate,
        ownerId: MOCK_USER_ID,
        settings: { create: {} },
      },
    });

    await prisma.day.createMany({
      data: Array.from({ length: dayCount }, (_, i) => ({
        date: addDays(startDate, i),
        tripId: newTrip.id,
        order: i,
      })),
    });

    const day = await prisma.day.findFirst({
      where: {
        tripId: newTrip.id,
        order: 0,
      },
    });

    if (day) {
      await prisma.stop.create({
        data: {
          order: 0,
          name: startStop.name,
          tripId: newTrip.id,
          placeId: startStop.placeId,
          latitude: startStop.latitude,
          longitude: startStop.longitude,
          dayId: day.id,
        },
      });
    }

    return NextResponse.json({ success: true, tripId: newTrip.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
