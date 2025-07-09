export interface PlaceSearchResult {
  id: string // This will be the Google Place ID
  name: string // This will be the description from Google
}

export interface PlaceDetails extends PlaceSearchResult {
  latitude: number
  longitude: number
}

export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  if (!query) return []
  const response = await fetch(`/api/places/autocomplete?query=${encodeURIComponent(query)}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to search places")
  }
  return response.json()
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await fetch(`/api/places/details?placeId=${placeId}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to get place details")
  }
  return response.json()
}
