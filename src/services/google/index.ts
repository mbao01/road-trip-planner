import { StatusCodes } from "http-status-codes";

/**
 * Gets a route matrix from Google Maps
 * @param data - The data to get the route matrix with
 * @returns The route matrix
 */
const getRouteMatrix = async (data: { origins: string[]; destinations: string[] }) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const { origins, destinations } = data;

  if (!googleMapsApiKey) {
    throw new Error("Google Maps API key is not configured", { cause: { status: 500 } });
  }

  const url = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix`;

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

  const matrix = await response.json();

  if (!response.ok) {
    console.error("Google Distance Matrix API error:", data);
    throw new Error(matrix.error_message || "Failed to fetch from Google Distance Matrix API", {
      cause: { status: response.status ?? StatusCodes.INTERNAL_SERVER_ERROR },
    });
  }

  return { matrix };
};

export const googleService = { getRouteMatrix };
