import { z } from "zod";

export const UpsertItinerarySchema = z.object({
  id: z.string().optional(),
  stopId: z.string(),
  name: z.string().optional(),
  notes: z.string().optional(),
  // assets: z.array(z.string()).optional(),
});

export type UpsertItineraryArg = z.infer<typeof UpsertItinerarySchema>;

export const DeleteItinerarySchema = z.object({
  itineraryId: z.string(),
});

export type DeleteItineraryArg = z.infer<typeof DeleteItinerarySchema>;
