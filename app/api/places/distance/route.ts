import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startLat = searchParams.get("startLat");
  const startLng = searchParams.get("startLng");
  const endLat = searchParams.get("endLat");
  const endLng = searchParams.get("endLng");
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!startLat || !startLng || !endLat || !endLng) {
    return NextResponse.json(
      { error: "startLat, startLng, endLat, and endLng parameters are required" },
      { status: 400 }
    );
  }
  if (!googleMapsApiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${endLat},${endLng}&origins=${startLat},${startLng}&mode=driving&key=${googleMapsApiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Distance Matrix API error:", data);
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch from Google Distance Matrix API" },
        { status: 500 }
      );
    }

    const { rows } = data;
    const result = rows[0].elements[0];
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching from place details API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
