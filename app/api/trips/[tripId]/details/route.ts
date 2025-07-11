import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { updateTripDetailsSchema } from "@/app/api/utilities/validation/schemas";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[tripId]/details - Updates only the top-level trip properties (name, dates)
export async function PUT(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const body = await request.json();
    const result = validator(body, updateTripDetailsSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId }, // In a real app, add access control check here
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}
