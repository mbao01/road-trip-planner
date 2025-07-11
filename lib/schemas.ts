import { Currency, DistanceUnit, MapStyle } from "@prisma/client";
import { z } from "zod";

export const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  startDate: z.date(),
  endDate: z.date(),
  startStop: z.object({
    id: z.string(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const updateTripSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  days: z
    .array(
      z.object({
        id: z.string().optional(),
        order: z.number(),
        date: z.coerce.date(),
        // stops: z.array(
        //   z.object({
        //     id: z.string(),
        //     name: z.string(),
        //     placeId: z.string(),
        //     latitude: z.number(),
        //     longitude: z.number(),
        //     order: z.number(),
        //     customName: z.string().optional(),
        //     dayId: z.string(),
        //   })
        // ),
      })
    )
    .optional(),
});

export const updateTripDetailsSchema = z.object({
  name: z.string().min(1).optional(),
});

export const updateSettingsSchema = z.object({
  mapStyle: z.enum(MapStyle).optional(),
  calculateCosts: z.boolean().optional(),
  currency: z.enum(Currency).optional(),
  fuelCostPerLitre: z.number().positive().optional(),
  mpg: z.number().int().positive().optional(),
  avoidTolls: z.boolean().optional(),
  avoidMotorways: z.boolean().optional(),
  distanceUnit: z.enum(DistanceUnit).optional(),
});

export const addStopSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const reorderSchema = z.array(
  z.object({
    id: z.string(),
    date: z.string(),
    stops: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    ),
  })
);
