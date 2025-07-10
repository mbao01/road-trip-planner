import { TravelWithDetails } from "@/types/trip";
import { formatCurrency } from "@/utilities/numbers";
import { convertCurrency } from "@/utilities/units/currency";
import { convertDistance } from "@/utilities/units/distance";
import { convertDuration } from "@/utilities/units/duration";
import { Settings, Travel } from "@prisma/client";
import { TRAVEL_MODE, TravelMode } from "./constants/travelMode";

export const calculateTravelDetails = (
  type: "stop" | "day" | "trip",
  travel: Travel | undefined,
  settings: Settings,
  id?: string
) => {
  const { travels = {} } = (travel ?? {}) as TravelWithDetails;

  const stop = id ? travels[id]?.details : undefined;
  let duration = 0,
    distance = 0,
    cost = 0;

  if (type === "trip") {
    Object.values(travels).forEach((value) => {
      duration += value.details?.duration ?? 0;
      distance += value.details?.distance ?? 0;
      cost += value.details?.cost ?? 0;
    });
  } else if (type === "day") {
    Object.values(travels).forEach((value) => {
      if (value?.details?.dayId === id) {
        duration += value?.details?.duration ?? 0;
        distance += value?.details?.distance ?? 0;
        cost += value?.details?.cost ?? 0;
      }
    });
  } else if (type === "stop") {
    if (stop) {
      duration = stop.duration ?? 0;
      distance = stop.distance ?? 0;
      cost = stop.cost ?? 0;
    }
  }

  const original = {
    distance,
    cost,
    duration,
  };

  const { currency, distanceUnit } = settings ?? {};

  // By default, distance is miles, cost is GBP and duration is minutes
  const { distance: normalizedDistance, unit: normalizedUnit } = convertDistance(
    original.distance,
    distanceUnit
  );
  const { amount: normalizedCost, unit: normalizedCurrency } = convertCurrency(
    original.cost,
    currency
  );
  const { hours, minutes } = convertDuration(original.duration);

  const computed = {
    distance: { value: normalizedDistance, unit: normalizedUnit },
    cost: { value: normalizedCost, unit: normalizedCurrency },
    duration: { hours, minutes },
  };

  const distanceString = `${normalizedDistance.toFixed(1)} ${normalizedUnit}`;
  const timeString = duration ? `${hours} hr ${minutes} min` : "0 hr";
  const priceString = `${formatCurrency(normalizedCost, {
    currency: normalizedCurrency,
  })}`;

  if (stop && type === "stop") {
    const normalizedMode = TRAVEL_MODE[stop.mode ?? TravelMode.DRIVING];
    return {
      original,
      computed,
      display: `${normalizedMode} ${distanceString} (${priceString}, ${timeString})`,
    };
  }

  return {
    original,
    computed,
    display: `${distanceString}, (${priceString}), ${timeString}`,
  };
};
