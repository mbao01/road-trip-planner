import { TripRole } from "@prisma/client";
import { z } from "zod";

export const addCollaboratorSchema = z.object({
  email: z.email(),
  tripRole: z.enum(TripRole),
});

export type AddCollaboratorArg = z.infer<typeof addCollaboratorSchema>;

export const updateCollaboratorSchema = z.object({
  tripRole: z.enum(TripRole),
});

export type UpdateCollaboratorArg = z.infer<typeof updateCollaboratorSchema>;
