import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { reorderSchema } from "@/lib/schemas"

// PUT /api/trips/[tripId]/reorder - Handles reordering of days and stops
export async function PUT(request: Request, { params }: { params: { tripId: string } }) {
  const { tripId } = params
  try {
    const body = await request.json()
    const validation = reorderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }
    const updatedDays = validation.data

    const transaction = updatedDays.flatMap((day, dayIndex) => {
      const dayUpdate = prisma.day.update({
        where: { id: day.id },
        data: { order: dayIndex, date: day.date },
      })
      const stopUpdates = day.stops.map((stop, stopIndex) =>
        prisma.stop.update({
          where: { id: stop.id },
          data: { order: stopIndex, dayId: day.id },
        }),
      )
      return [dayUpdate, ...stopUpdates]
    })

    await prisma.$transaction(transaction)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Failed to reorder trip ${tripId}:`, error)
    return NextResponse.json({ error: "Failed to reorder trip" }, { status: 500 })
  }
}
