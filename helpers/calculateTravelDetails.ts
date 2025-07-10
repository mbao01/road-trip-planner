import { getDistanceMatrix } from "@/lib/google-maps-api";
import { Stop } from "@prisma/client";

export function calculateTravelDetails(currentStop: Stop, previousStop: Stop) {
  const distance = getDistanceMatrix(previousStop, currentStop);
  console.log(distance);
}
