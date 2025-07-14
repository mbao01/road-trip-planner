import { Currency, DistanceUnit, MapStyle, Settings } from "@prisma/client";
import { Omit } from "@prisma/client/runtime/library";

const DEFAULT_SETTINGS = {
  avoidMotorways: false,
  avoidTolls: false,
  calculateCosts: true,
  currency: Currency.GBP,
  distanceUnit: DistanceUnit.MI,
  fuelCostPerLitre: 1.3,
  mapStyle: MapStyle.DEFAULT,
  mpg: 1,
} satisfies Omit<Settings, "id" | "tripId" | "createdAt" | "updatedAt">;

const getNormalizedSettings = (
  settings: Omit<Settings, "id" | "tripId" | "createdAt" | "updatedAt"> | null
) => {
  if (settings) {
    return {
      ...settings,
      mapStyle: settings.mapStyle ?? DEFAULT_SETTINGS.mapStyle,
      calculateCosts: settings.calculateCosts ?? DEFAULT_SETTINGS.calculateCosts,
      currency: settings.currency ?? DEFAULT_SETTINGS.currency,
      fuelCostPerLitre: settings.fuelCostPerLitre ?? DEFAULT_SETTINGS.fuelCostPerLitre,
      mpg: settings.mpg ?? DEFAULT_SETTINGS.mpg,
      avoidTolls: settings.avoidTolls ?? DEFAULT_SETTINGS.avoidTolls,
      avoidMotorways: settings.avoidMotorways ?? DEFAULT_SETTINGS.avoidMotorways,
      distanceUnit: settings.distanceUnit ?? DEFAULT_SETTINGS.distanceUnit,
    };
  }

  return DEFAULT_SETTINGS;
};

export type NormalizedSettings = ReturnType<typeof getNormalizedSettings>;

export const settingsHelpers = {
  getNormalizedSettings,
};
