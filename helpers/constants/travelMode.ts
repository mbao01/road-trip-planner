import { TravelMode } from "@prisma/client";

export const TRAVEL_MODE = {
  [TravelMode.DRIVING]: "Drive",
  [TravelMode.WALKING]: "Walk",
  [TravelMode.BICYCLING]: "Bike",
  [TravelMode.TRANSIT]: "Public Transport",
};
