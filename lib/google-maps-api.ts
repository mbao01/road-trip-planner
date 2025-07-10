import { Stop } from "@prisma/client";

export interface PlaceSearchResult {
  id: string; // This will be the Google Place ID
  name: string; // This will be the description from Google
}

export interface PlaceDetails extends PlaceSearchResult {
  latitude: number;
  longitude: number;
}

export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  if (!query) return [];
  const response = await fetch(`/api/places/autocomplete?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to search places");
  }
  return response.json();
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await fetch(`/api/places/details?placeId=${placeId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get place details");
  }
  return response.json();
}

type Position = { latitude: number; longitude: number };
export async function getRoute(startPos: Position, endPos: Position): Promise<PlaceDetails> {
  const response = await fetch(
    `/api/routes?startLat=${startPos.latitude}&startLng=${startPos.longitude}&endLat=${endPos.latitude}&endLng=${endPos.longitude}`
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get distance matrix");
  }
  return response.json();
}

export async function getRouteMatrix(stops: Stop[]): Promise<PlaceDetails> {
  const origins = stops.map((stop) => stop.placeId);
  const destinations = origins;

  // TODO::
  // - Add support for caching such that only places without a route matrix are fetched

  const response = await fetch(`/api/routes/matrix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origins, destinations }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get distance matrix");
  }
  return response.json();
}
