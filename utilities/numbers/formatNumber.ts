import { type FormatNumberFn } from "./types";

export const formatNumber: FormatNumberFn = (value, options = {}) => {
  if (typeof value !== "number" && !value) return null;

  const { divisor, ...rest } = options;
  const config = {
    notation: "compact",
    ...rest,
  } as Intl.NumberFormatOptions;
  const formatter = Intl.NumberFormat("en", config);

  return formatter.format(Number(value) / (divisor || 1));
};
