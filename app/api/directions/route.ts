import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const waypoints = searchParams.get("waypoints")

  if (!origin || !destination) {
    return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 })
  }

  // Note: On the backend, we use a non-public env var for security.
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  const params = new URLSearchParams({
    origin,
    destination,
    key: googleMapsApiKey,
  })

  if (waypoints) {
    params.append("waypoints", waypoints)
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("Google Maps API error:", errorData)
      return NextResponse.json({ error: "Failed to fetch directions from Google Maps" }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching directions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
