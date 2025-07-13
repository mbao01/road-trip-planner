import { z } from "zod";

export const addStopSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  customName: z.string().optional(),
});

export type AddStopArg = z.infer<typeof addStopSchema>;
