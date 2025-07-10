import { Currency } from "@prisma/client";

export const convertCurrency = (amount: number, currency: Currency | null) => {
  const unit = currency ?? Currency.GBP;

  if (unit === Currency.USD) {
    // TODO: Get exchange rate from API
    return { amount: amount * 1.2, unit: Currency.USD };
  } else if (unit === Currency.EUR) {
    // TODO: Get exchange rate from API
    return { amount: amount * 1.1, unit: Currency.EUR };
  }

  return { amount, unit };
};
