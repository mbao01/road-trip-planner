import { isObject } from "./isObject";

export const isKeysInObject = (keys: string[], obj: unknown): boolean => {
  let current = obj;
  for (const key of keys) {
    if (!(isObject(current) && current.hasOwnProperty(key))) {
      return false;
    }
    current = current[key];
  }
  return true;
};
