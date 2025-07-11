import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { updateTripSettingsSchema } from "@/app/api/utilities/validation/schemas";
import { updateSettingsForTrip } from "@/services/settings";

// PUT /api/trips/[tripId]/settings
export async function PUT(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const body = await request.json();
    const result = validator(body, updateTripSettingsSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedSettings = await updateSettingsForTrip(tripId, result.data);
    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error(`Failed to update settings for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
