import { NextRequest, NextResponse } from "next/server";
import { validator } from "@/app/api/utilities/validation";
import { updateTripSchema } from "@/app/api/utilities/validation/schemas";
import { deleteTrip, getTripWithDetails, updateTripWithDays } from "@/services/trip";

const MOCK_USER_ID = "1"; // Hardcoded user

// GET /api/trips/[tripId] - Assembles and returns the full trip object
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  try {
    const trip = await getTripWithDetails(tripId, MOCK_USER_ID);

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found or you don't have access" },
        { status: 404 }
      );
    }

    if (!trip.travel && trip._count.stops > 1) {
      try {
        const url = new URL(`/api/trips/${tripId}/travel`, request.nextUrl.origin);
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        const { data: travel } = await res.json();
        trip.travel = travel;
      } catch (error) {
        console.error(`Failed to retrieve travel for trip ${tripId}:`, error);
      }
    }

    let access: "Owner" | "Editor" | "Viewer" = "Owner";
    if (trip.ownerId !== MOCK_USER_ID) {
      const role = trip.collaborators[0]?.role;
      if (role === "EDITOR") access = "Editor";
      if (role === "VIEWER") access = "Viewer";
    }

    return NextResponse.json({ ...trip, access });
  } catch (error) {
    console.error(`Failed to retrieve trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to retrieve trip data" }, { status: 500 });
  }
}

// PUT /api/trips/[tripId] - Updates trip days and stops, including start date and end date
export async function PUT(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const body = await request.json();
    const result = validator(body, updateTripSchema);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedTrip = await updateTripWithDays(tripId, result.data);
    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error(`Failed to update trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  try {
    await deleteTrip(tripId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete trip ${tripId}:`, error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
