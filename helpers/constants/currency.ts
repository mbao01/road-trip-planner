import { Currency } from "@prisma/client";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.GBP]: "£",
  [Currency.EUR]: "€",
  [Currency.USD]: "$",
};
