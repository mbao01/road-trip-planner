import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateSettingsSchema } from "@/lib/schemas"

// PUT /api/trip/[tripId]/settings
export async function PUT(request: Request, { params }: { params: { tripId: string } }) {
  const { tripId } = params
  try {
    const body = await request.json()
    const validation = updateSettingsSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const updatedSettings = await prisma.settings.update({
      where: { tripId: tripId }, // In a real app, add access control check here
      data: validation.data,
    })

    return NextResponse.json({ success: true, data: updatedSettings })
  } catch (error) {
    console.error(`Failed to update settings for trip ${tripId}:`, error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
