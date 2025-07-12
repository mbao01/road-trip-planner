import { formatNumber } from "./formatNumber";
import { type FormatCurrencyFn } from "./types";

export const formatCurrency: FormatCurrencyFn = (value, options) => {
  if (typeof value !== "number" && !value) return null;
  const isLarge = String(value).length >= 4;

  const notation = options?.auto && isLarge ? "compact" : "standard";
  const fraction = options?.integer ? 0 : options?.auto && isLarge ? 0 : 2;
  const currency = options?.currency ?? "NGN";

  const config = {
    notation,
    currency,
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
    style: "currency",
    currencyDisplay: "narrowSymbol",
  } as Intl.NumberFormatOptions;

  return formatNumber(value, config);
};
