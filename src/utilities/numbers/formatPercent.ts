import { formatNumber } from "./formatNumber";
import { type FormatNumberFn } from "./types";

export const formatPercent: FormatNumberFn = (value, options = {}) => {
  return formatNumber(value, { ...options, divisor: 100, style: "percent" });
};
