import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createTripSchema } from "@/lib/schemas"
import { parse, isBefore, isAfter, format, addDays, differenceInDays } from "date-fns"

// A hardcoded user for demonstration purposes.
// In a real app, this would come from an authentication session.
const MOCK_USER_ID = 1

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
    })

    const now = new Date()
    const tripsWithDetails = userTrips.map((trip) => {
      const [startStr, endStr] = trip.dates.split(" - ")
      const startDate = parse(startStr, "dd/MM/yyyy", new Date())
      const endDate = parse(endStr, "dd/MM/yyyy", new Date())

      let tripStatus: "Not Started" | "In Progress" | "Completed" | "Archived" = "Not Started"
      if (trip.status === "archived") {
        tripStatus = "Archived"
      } else if (isBefore(now, startDate)) {
        tripStatus = "Not Started"
      } else if (isAfter(now, endDate)) {
        tripStatus = "Completed"
      } else {
        tripStatus = "In Progress"
      }

      let access: "Owner" | "Editor" | "Viewer" = "Owner"
      if (trip.ownerId !== MOCK_USER_ID) {
        const role = trip.collaborators[0]?.role
        if (role === "EDITOR") access = "Editor"
        if (role === "VIEWER") access = "Viewer"
      }

      return {
        id: trip.id,
        name: trip.name,
        startDate: startStr,
        endDate: endStr,
        dayCount: trip.days.length,
        stopCount: trip.days.reduce((acc, day) => acc + day.stops.length, 0),
        status: tripStatus,
        access: access,
      }
    })

    return NextResponse.json(tripsWithDetails)
  } catch (error) {
    console.error("Failed to retrieve trips:", error)
    return NextResponse.json({ error: "Failed to retrieve trips" }, { status: 500 })
  }
}

// POST /api/trips - Creates a new trip
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = createTripSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }
    const { name, dates, startStop } = validation.data

    const startDate = new Date(dates.from)
    const endDate = new Date(dates.to)
    const dayCount = differenceInDays(endDate, startDate) + 1

    const newTrip = await prisma.trip.create({
      data: {
        name,
        dates: `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`,
        ownerId: MOCK_USER_ID,
        days: {
          create: Array.from({ length: dayCount }, (_, i) => ({
            date: format(addDays(startDate, i), "EEE, d MMM"),
            order: i,
            stops:
              i === 0
                ? {
                    create: [
                      {
                        name: startStop.name,
                        driving: "",
                        latitude: startStop.latitude,
                        longitude: startStop.longitude,
                        order: 0,
                      },
                    ],
                  }
                : undefined,
          })),
        },
        settings: { create: {} },
      },
    })

    return NextResponse.json({ success: true, tripId: newTrip.id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create trip:", error)
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 })
  }
}
