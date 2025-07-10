import type { MeterCreditFilters } from "@/app/api/graphql/types";
import { CreditType } from "@/app/api/utilities/validation/enums";
import { z } from "zod";
import { paginationSchema } from "./pagination";
import { dateRangeFilterSchema, rangeFilterSchema } from "./range";

export const creditsFiltersSchema: z.ZodObject<{
  filters: z.ZodType<MeterCreditFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        created_at: dateRangeFilterSchema,
        credit_delta: rangeFilterSchema,
        credit_type: z.nativeEnum(CreditType),
        updated_at: dateRangeFilterSchema,
      })
      .partial(),
  })
  .merge(paginationSchema)
  .partial();

export const combinedCreditsFiltersSchema = z
  .object({
    credits: creditsFiltersSchema,
  })
  .partial();
