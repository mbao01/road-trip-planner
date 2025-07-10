export enum TravelMode {
  DRIVING = "DRIVING",
  WALKING = "WALKING",
  BICYCLING = "BICYCLING",
  TRANSIT = "TRANSIT",
}

export const TRAVEL_MODE = {
  [TravelMode.DRIVING]: "Drive",
  [TravelMode.WALKING]: "Walk",
  [TravelMode.BICYCLING]: "Bike",
  [TravelMode.TRANSIT]: "Public Transport",
};
