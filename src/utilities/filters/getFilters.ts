import { validator } from "@/app/api/utilities/validation";
import dot from "dot-object";
import { z } from "zod";

export const getFilters = <T>(variables: unknown, schema: z.Schema<T>) => {
  const nestedVariables = dot.object(variables ?? {});
  const result = validator(nestedVariables, schema);

  if (!result.success) return {} as T;

  return result.data;
};
