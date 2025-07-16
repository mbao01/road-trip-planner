import { StopEvent } from "@prisma/client";
import { z } from "zod";

export const addStopSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  customName: z.string().nullish(),
});

export type AddStopArg = z.infer<typeof addStopSchema>;

export const updateStopSchema = z.object({
  stopEvent: z.enum(StopEvent).optional(),
  stopCost: z.coerce.number().nullish(),
  customName: z.string().nullish(),
});

export type UpdateStopArg = z.infer<typeof updateStopSchema>;
