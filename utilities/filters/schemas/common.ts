import { z } from "zod";

const idSchema = (message: string) => z.string().refine((val) => !isNaN(Number(val)), { message });

export const customerIdSchema = z.object({
  customer_id: idSchema("Customer does not exist"),
});

export const meterIdSchema = z.object({
  meter_id: idSchema("Meter does not exist"),
});

export const paymentIdSchema = z.object({
  payment_id: idSchema("Payment does not exist"),
});

export const propertyIdSchema = z.object({
  property_id: idSchema("Property does not exist"),
});

export const propertyIdsSchema = z.object({
  property_ids: z
    .array(z.string())
    .refine((vals) => !vals.some((val) => isNaN(Number(val))), {
      message: "Certain properties do not exist",
    }),
});

export const roleIdSchema = z.object({
  role_id: idSchema("Role does not exist"),
});

export const tariffIdSchema = z.object({
  tariff_id: idSchema("Tariff does not exist"),
});
