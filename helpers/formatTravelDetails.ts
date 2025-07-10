import { formatCurrency, formatNumber } from "@/utilities/numbers";
import { Currency, DistanceUnit, Settings, Travel, TravelMode } from "@prisma/client";
import { DISTANCE_UNITS } from "./constants/distance";
import { TRAVEL_MODE } from "./constants/travelMode";

export const formatTravelDetails = (travel: Travel | undefined, settings: Settings) => {
  const { currency, distanceUnit } = settings;
  const { mode, distance = 0, duration = 0, cost = 0 } = travel ?? {};

  // By default, distance is miles, cost is GBP and duration is minutes
  let normalizedDistance = distance;
  let normalizedCost = cost;
  const normalizedMode = TRAVEL_MODE[mode ?? TravelMode.DRIVING];

  if (currency === Currency.USD) {
    // TODO: Get exchange rate from API
    normalizedCost = cost * 1.2;
  } else if (currency === Currency.EUR) {
    // TODO: Get exchange rate from API
    normalizedCost = cost * 1.1;
  }

  if (distanceUnit === DistanceUnit.KM) {
    normalizedDistance = distance * 1.60934;
  }

  const dist = `${formatNumber(normalizedDistance)} ${
    DISTANCE_UNITS[distanceUnit ?? DistanceUnit.MI]
  }`;
  const time = duration ? `${Math.floor(duration / 60)} hr ${duration % 60} min` : "0 hr";
  const price = `${formatCurrency(normalizedCost, {
    currency: currency ?? Currency.GBP,
  })}`;

  return `${normalizedMode} ${dist} (${price}, ${time})`;
};
