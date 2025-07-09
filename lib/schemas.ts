import { z } from "zod"

export const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  dates: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  startStop: z.object({
    id: z.string(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
})

export const updateTripSchema = z.object({
  name: z.string().min(1).optional(),
  dates: z.string().optional(), // Assuming "dd/MM/yyyy - dd/MM/yyyy" format
})

export const updateSettingsSchema = z.object({
  mapStyle: z.enum(["default", "outdoors", "satellite"]).optional(),
  calculateCosts: z.boolean().optional(),
  currency: z.enum(["gbp", "eur", "usd"]).optional(),
  fuelCostPerLitre: z.number().positive().optional(),
  mpg: z.number().int().positive().optional(),
  avoidTolls: z.boolean().optional(),
  avoidMotorways: z.boolean().optional(),
  distanceUnit: z.enum(["mi", "km"]).optional(),
})

export const addStopSchema = z.object({
  name: z.string(),
  driving: z.string().optional().default(""),
  latitude: z.number(),
  longitude: z.number(),
})

export const reorderSchema = z.array(
  z.object({
    id: z.number(),
    date: z.string(),
    stops: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        driving: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    ),
  }),
)
