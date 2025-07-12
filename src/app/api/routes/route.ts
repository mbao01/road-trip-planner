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

  const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleMapsApiKey,
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.staticDuration,routes.localizedValues",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: Number(startLat),
              longitude: Number(startLng),
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: Number(endLat),
              longitude: Number(endLng),
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "METRIC",
      }),
    });
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Distance Matrix API error:", data);
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch from Google Distance Matrix API" },
        { status: 500 }
      );
    }

    const { routes } = data;
    const result = {
      distance: routes[0].distanceMeters,
      duration: routes[0].duration,
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching from routes API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
