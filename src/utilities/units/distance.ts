import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import { DistanceUnit } from "@prisma/client";

/**
 *
 * @param distance -  original distance in meters
 * @param distanceUnit - target unit
 * @returns distance in target unit and unit name
 */
export const convertDistance = (distance: number, distanceUnit: DistanceUnit | null) => {
  const targetUnit = distanceUnit ?? DistanceUnit.MI;
  const unit = DISTANCE_UNITS[targetUnit];

  if (targetUnit === DistanceUnit.KM) {
    return {
      distance: distance / 1000,
      unit,
    };
  }

  if (targetUnit === DistanceUnit.MI) {
    return {
      distance: distance / 1609.34,
      unit,
    };
  }

  return { distance, unit };
};
