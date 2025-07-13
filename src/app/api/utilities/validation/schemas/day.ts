import { z } from "zod";

export const reorderDaysSchema = z.array(
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

export type ReorderDaysArg = z.infer<typeof reorderDaysSchema>;
