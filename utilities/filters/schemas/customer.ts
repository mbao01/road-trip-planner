import { CustomerFilters } from "@/app/api/graphql/types";
import { z } from "zod";
import { paginationSchema } from "./pagination";
import { dateRangeFilterSchema } from "./range";

export const customersFiltersSchema: z.ZodObject<{
  filters: z.ZodType<CustomerFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        email: z.string().email(),
        search_keyword: z.string(), // search across the customer's "name", "email" and "phone number"
        created_at: dateRangeFilterSchema,
        updated_at: dateRangeFilterSchema,
      })
      .partial(),
  })
  .merge(paginationSchema)
  .partial();
