import { Currency } from "@prisma/client";

type FormatNumberValue = number | string | undefined | null;
type FormatNumberOptions = Partial<{ divisor: number }> &
  Pick<
    Intl.NumberFormatOptions,
    | "notation"
    | "currency"
    | "style"
    | "minimumFractionDigits"
    | "maximumFractionDigits"
  >;

export type FormatNumberFn = (
  value: FormatNumberValue,
  options?: FormatNumberOptions
) => string | null;

type FormatCurrencyOptions = Partial<{
  auto: boolean;
  integer: boolean;
  currency: Currency;
}>;

export type FormatCurrencyFn = (
  a: FormatNumberValue,
  options?: FormatCurrencyOptions
) => string | null;
