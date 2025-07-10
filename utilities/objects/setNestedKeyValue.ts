import { isObject } from "./isObject";

export const setNestedKeyValue = (keys: string[], value: unknown, obj: Record<string, any>) => {
  const initial = structuredClone(obj);
  let current = initial;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // If we're at the last key, set the value
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      // If the key doesn't exist or isn't an object, create an empty object
      if (!isObject(current[key])) {
        current[key] = {};
      }
      // Move to the next level
      current = current[key];
    }
  }
  return initial;
};
