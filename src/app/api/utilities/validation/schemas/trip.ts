import { Currency, DistanceUnit, MapStyle, TripAccess, TripStatus } from "@prisma/client";
import { z } from "zod";

export const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  startStop: z.object({
    name: z.string(),
    placeId: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export type CreateTripArg = z.infer<typeof createTripSchema>;

export const updateTripSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  days: z
    .array(
      z.object({
        id: z.string().optional(),
        order: z.number(),
        date: z.coerce.date(),
      })
    )
    .optional(),
});

export type UpdateTripArg = z.infer<typeof updateTripSchema>;

export const updateTripDetailsSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(TripStatus).optional(),
  access: z.enum(TripAccess).optional(),
});

export type UpdateTripDetailsArg = z.infer<typeof updateTripDetailsSchema>;

export const updateTripSettingsSchema = z.object({
  mapStyle: z.enum(MapStyle).optional(),
  calculateCosts: z.boolean().optional(),
  currency: z.enum(Currency).optional(),
  fuelCostPerLitre: z.number().positive().optional(),
  mpg: z.number().int().positive().optional(),
  avoidTolls: z.boolean().optional(),
  avoidMotorways: z.boolean().optional(),
  distanceUnit: z.enum(DistanceUnit).optional(),
});

export type UpdateTripSettingsArg = z.infer<typeof updateTripSettingsSchema>;
