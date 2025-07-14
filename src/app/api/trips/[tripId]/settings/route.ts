import { NextResponse } from "next/server";
import { settingsService } from "@/services/settings";

/**
 * PUT /api/trips/[tripId]/settings
 * @returns The updated trip settings
 */
export async function PUT(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const body = await req.json();

    const updatedSettings = await settingsService.updateSettings({ tripId }, body);

    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error(`Failed to update settings for trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
