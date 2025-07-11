import type { MeterFilters } from "@/app/api/graphql/types";
import { MeterBilling, MeterType } from "@/app/api/utilities/validation/enums";
import { z } from "zod";
import { customerIdSchema } from "./common";
import { paginationSchema } from "./pagination";
import { dateRangeFilterSchema, rangeFilterSchema } from "./range";

export const metersFiltersSchema: z.ZodObject<{
  filters: z.ZodType<MeterFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        name: z.string(),
        sn: z.string().min(11),
        meter_code: z.string(),
        meter_type: z.nativeEnum(MeterType),
        meter_billing_type: z.nativeEnum(MeterBilling),
        type: z.string(), // type based on manufacturer info For example: wuxi_taojin_3ph
        search_keyword: z.string(), // search across the meter "name" only
        meter_tariff: rangeFilterSchema,
        created_at: dateRangeFilterSchema,
        updated_at: dateRangeFilterSchema,
      })
      .merge(customerIdSchema)
      .partial(),
  })
  .merge(paginationSchema)
  .partial();
