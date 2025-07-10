import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }
  if (!googleMapsApiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query,
  )}&key=${googleMapsApiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "OK") {
      console.error("Google Places API error:", data)
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch from Google Places API" },
        { status: 500 },
      )
    }

    const results = data.predictions.map((p: any) => ({
      id: p.place_id,
      name: p.description,
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching from autocomplete API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
