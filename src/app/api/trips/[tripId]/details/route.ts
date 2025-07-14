import { NextRequest, NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { updateTripDetailsSchema } from "@/app/api/utilities/validation/schemas";
import { tripRepo } from "@/repository/trip";
import { TripRole } from "@prisma/client";

/**
 * PUT /api/trips/[tripId]/details
 * Updates only the top-level trip properties (name, status, access)
 * @returns The updated trip
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    const body = await req.json();
    const result = validator(body, updateTripDetailsSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedTrip = await tripRepo.updateTripDetails(session.user.id, tripId, result.data);

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}
