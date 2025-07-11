import { TravelMode } from "@/app/api/utilities/validation/enums";

export const TRAVEL_MODE = {
  [TravelMode.DRIVING]: "Drive",
  [TravelMode.WALKING]: "Walk",
  [TravelMode.BICYCLING]: "Bike",
  [TravelMode.TRANSIT]: "Public Transport",
};
