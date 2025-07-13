import { NextResponse } from "next/server";
import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { updateTripSettingsSchema } from "@/app/api/utilities/validation/schemas";
import { updateTripSettings } from "@/services/settings";
import { TripRole } from "@prisma/client";

/**
 * PUT /api/trips/[tripId]/settings
 * @returns The updated trip settings
 */
export async function PUT(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  try {
    const body = await req.json();
    const result = validator(body, updateTripSettingsSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedSettings = await updateTripSettings(tripId, result.data);
    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error(`Failed to update settings for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
