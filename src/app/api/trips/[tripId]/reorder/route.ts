import { NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { reorderDaysSchema } from "@/app/api/utilities/validation/schemas";
import { bulkUpdateStopsOrder } from "@/services/stop";

/**
 * PUT /api/trips/[tripId]/reorder
 * @returns The updated trip
 */
export async function PUT(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  try {
    const body = await req.json();
    const result = validator(body, reorderDaysSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    await bulkUpdateStopsOrder(result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to reorder trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to reorder trip" }, { status: 500 });
  }
}
