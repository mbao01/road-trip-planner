import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const body = await request.json();
  const { origins, destinations } = body;

  if (!origins || !destinations) {
    return NextResponse.json(
      { error: "'origins' and 'destinations' properties are required" },
      { status: 400 }
    );
  }

  if (!googleMapsApiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 });
  }

  const url = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleMapsApiKey,
        "X-Goog-FieldMask":
          "originIndex,destinationIndex,status,condition,distanceMeters,duration,staticDuration",
      },
      body: JSON.stringify({
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        // TODO:: how to pass route modifiers e.g avoidTolls, avoidHighways, avoidFerries
        // "extraComputations": ["TOLLS"],
        languageCode: "en-US",
        units: "METRIC",
        origins: origins.map((placeId: string) => ({
          waypoint: { placeId },
        })),
        destinations: destinations.map((placeId: string) => ({
          waypoint: { placeId },
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Distance Matrix API error:", data);
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch from Google Distance Matrix API" },
        { status: response.status ?? 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from routes API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
