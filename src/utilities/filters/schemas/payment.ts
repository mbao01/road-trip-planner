import type { IntermediatePaymentFilters, PaymentFilters } from "@/app/api/graphql/types";
import { PaymentState, PaymentType } from "@/app/api/utilities/validation/enums";
import { z } from "zod";
import { customerIdSchema, meterIdSchema } from "./common";
import { paginationSchema } from "./pagination";
import { dateRangeFilterSchema, rangeFilterSchema } from "./range";

export const paymentsFiltersSchema: z.ZodObject<{
  filters: z.ZodType<PaymentFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        disco_meter_id: z.string(),
        payment_type: z.nativeEnum(PaymentType),
        payment_state: z.nativeEnum(PaymentState),
        provider_txn_ref: z.string(),
        units: rangeFilterSchema,
        amount_paid: rangeFilterSchema,
        created_at: dateRangeFilterSchema,
        updated_at: dateRangeFilterSchema,
      })
      .merge(customerIdSchema)
      .merge(meterIdSchema)
      .partial(),
  })
  .merge(paginationSchema)
  .partial();

export const intermediatePaymentsFiltersSchema: z.ZodObject<{
  filters: z.ZodType<IntermediatePaymentFilters | undefined>;
}> = z
  .object({
    filters: z
      .object({
        disco_meter_id: z.string(),
        provider_txn_ref: z.string(),
        amount_paid: rangeFilterSchema,
        created_at: dateRangeFilterSchema,
        updated_at: dateRangeFilterSchema,
      })
      .merge(customerIdSchema)
      .merge(meterIdSchema)
      .partial(),
  })
  .merge(paginationSchema)
  .partial();

export const combinedPaymentsAndIntermediatePaymentsFiltersSchema = z
  .object({
    payments: paymentsFiltersSchema,
    intermediate_payments: intermediatePaymentsFiltersSchema,
  })
  .partial();
