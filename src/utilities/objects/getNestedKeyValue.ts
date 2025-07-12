import { isObject } from "./isObject";

export const getNestedKeyValue = (keys: string[], obj: unknown): unknown => {
  let current = obj;
  for (const key of keys) {
    if (!(isObject(current) && current.hasOwnProperty(key))) {
      return undefined;
    }
    current = current[key];
  }
  return current;
};
