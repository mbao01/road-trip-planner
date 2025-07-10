import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get("placeId")
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId) {
    return NextResponse.json({ error: "placeId parameter is required" }, { status: 400 })
  }
  if (!googleMapsApiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry&key=${googleMapsApiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "OK") {
      console.error("Google Place Details API error:", data)
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch from Google Place Details API" },
        { status: 500 },
      )
    }

    const { result } = data
    const location = {
      id: placeId,
      name: result.name,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error("Error fetching from place details API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
