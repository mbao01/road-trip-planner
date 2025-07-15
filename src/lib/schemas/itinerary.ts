import { z } from "zod";

export const CreateItinerarySchema = z.object({
  stopId: z.string(),
  name: z.string().optional(),
  notes: z.string().optional(),
  // assets: z.array(z.string()).optional(),
});

export type CreateItineraryArg = z.infer<typeof CreateItinerarySchema>;

export const UpdateItinerarySchema = z.object({
  itineraryId: z.string(),
  stopId: z.string(),
  name: z.string().optional(),
  notes: z.string().optional(),
  // assets: z.array(z.string()).optional(),
});

export type UpdateItineraryArg = z.infer<typeof UpdateItinerarySchema>;

export const DeleteItinerarySchema = z.object({
  itineraryId: z.string(),
});

export type DeleteItineraryArg = z.infer<typeof DeleteItinerarySchema>;
