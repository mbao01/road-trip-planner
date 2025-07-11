import invariant from "tiny-invariant";
import { z } from "zod";

export const validator = <T>(data: unknown, schema: z.Schema<T>) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.formErrors.fieldErrors;
    const message = result.error.format();
    return { success: false, fieldErrors, message } as const;
  }

  return result;
};

const invariantValidator = <T>(data: unknown, schema: z.Schema<T>, message?: string) => {
  const result = schema.safeParse(data);
  let messages = message ? [message] : [];

  if (messages.length === 0 && !result.success) {
    Object.entries(result.error.formErrors.fieldErrors).forEach(([key, value]) => {
      messages = [...messages, ...(value as string[]).map((error) => `[${key}] - ${error}\n`)];
    });
  }

  invariant(result.success, messages.join("\n"));

  return result;
};

validator.invariant = invariantValidator;
