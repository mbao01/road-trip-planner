import { z } from "zod";

export const addStopSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
