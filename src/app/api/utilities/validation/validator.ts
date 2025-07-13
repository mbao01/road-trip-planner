import invariant from "tiny-invariant";
import { z } from "zod";

export const validator = <T>(data: unknown, schema: z.Schema<T>) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = z.treeifyError(result.error);
    const message = result.error.format();
    return { success: false, errors, message } as const;
  }

  return result;
};

const invariantValidator = <T>(data: unknown, schema: z.Schema<T>, message?: string) => {
  const result = schema.safeParse(data);
  let messages = message ? [message] : [];

  if (messages.length === 0 && !result.success) {
    Object.entries(z.treeifyError(result.error)).forEach(([key, value]) => {
      messages = [...messages, ...(value as string[]).map((error) => `[${key}] - ${error}\n`)];
    });
  }

  invariant(result.success, messages.join("\n"));

  return result;
};

validator.invariant = invariantValidator;
