import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateTripSchema } from "@/lib/schemas"

const MOCK_USER_ID = 1 // Hardcoded user

// GET /api/trip/[tripId] - Assembles and returns the full trip object
export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  const { tripId } = params
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [{ ownerId: MOCK_USER_ID }, { collaborators: { some: { userId: MOCK_USER_ID } } }],
      },
      include: {
        days: {
          orderBy: { order: "asc" },
          include: { stops: { orderBy: { order: "asc" } } },
        },
        settings: true,
        collaborators: { where: { userId: MOCK_USER_ID } },
      },
    })

    if (!trip) {
      return NextResponse.json({ error: "Trip not found or you don't have access" }, { status: 404 })
    }

    let access: "Owner" | "Editor" | "Viewer" = "Owner"
    if (trip.ownerId !== MOCK_USER_ID) {
      const role = trip.collaborators[0]?.role
      if (role === "EDITOR") access = "Editor"
      if (role === "VIEWER") access = "Viewer"
    }

    const { collaborators, ...tripData } = trip
    return NextResponse.json({ ...tripData, access })
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error)
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 })
  }
}

// PUT /api/trip/[tripId] - Updates only the top-level trip properties (name, dates)
export async function PUT(request: Request, { params }: { params: { tripId: string } }) {
  const { tripId } = params
  try {
    const body = await request.json()
    const validation = updateTripSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId }, // In a real app, add access control check here
      data: validation.data,
    })

    return NextResponse.json({ success: true, data: updatedTrip })
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error)
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 })
  }
}
