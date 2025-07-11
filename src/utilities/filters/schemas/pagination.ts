import { z } from "zod";

export const paginationSchema = z
  .object({
    page: z.number({ coerce: true }).min(1),
    per_page: z.number({ coerce: true }).min(1).max(300),
  })
  .partial();
