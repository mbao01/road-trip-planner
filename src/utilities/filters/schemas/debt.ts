import type { DebtLogFilters, ScheduledDebtFilters } from "@/app/api/graphql/types";
import {
  DebtType,
  ScheduledDebtInterval,
  ScheduledDebtType,
} from "@/app/api/utilities/validation/enums";
import { z } from "zod";
import { paginationSchema } from "./pagination";
import { dateRangeFilterSchema, rangeFilterSchema } from "./range";

export const debtsFiltersSchema: z.ZodObject<{
  filters: z.ZodType<DebtLogFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        created_at: dateRangeFilterSchema,
        debt_delta: rangeFilterSchema,
        debt_type: z.nativeEnum(DebtType),
        updated_at: dateRangeFilterSchema,
      })
      .partial(),
  })
  .merge(paginationSchema)
  .partial();

export const scheduledDebtsFiltersSchema: z.ZodObject<{
  filters: z.ZodType<ScheduledDebtFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        created_at: dateRangeFilterSchema,
        debt_amount: rangeFilterSchema,
        debt_interval: z.nativeEnum(ScheduledDebtInterval),
        debt_type: z.nativeEnum(ScheduledDebtType),
        updated_at: dateRangeFilterSchema,
      })
      .partial(),
  })
  .merge(paginationSchema)
  .partial();

export const combinedDebtsAndScheduledDebtsFiltersSchema = z
  .object({
    debts: debtsFiltersSchema,
    scheduled_debts: scheduledDebtsFiltersSchema,
  })
  .partial();
