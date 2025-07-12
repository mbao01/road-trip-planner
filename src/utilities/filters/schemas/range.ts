import { z } from "zod";

const dateStringSchema = z
  .date()
  .refine((val) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(String(val)), {
    message: "Invalid date/time value",
  });

/** min and max should be in the format 'YYYY-MM-DD hh:mm:ss'. For example: {min: "2020-11-14 11:09:42"} */
export const dateRangeFilterSchema = z
  .object({
    // min: dateStringSchema,
    // max: dateStringSchema,
    min: z.date({ coerce: true }),
    max: z.date({ coerce: true }),
  })
  .partial();

/** min and max should be numbers. For example: {min: 30} */
export const rangeFilterSchema = z
  .object({
    min: z.number({ coerce: true }),
    max: z.number({ coerce: true }),
  })
  .partial();
