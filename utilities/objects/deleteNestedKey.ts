import { isObject } from "./isObject";

export const deleteNestedKey = (keys: string[], obj: unknown) => {
  const initial = structuredClone(obj);

  if (keys.length === 0 || !isObject(obj)) {
    return initial;
  }

  let current = initial;
  const stack: Array<{ parent: Record<string, any>; key: string }> = [];

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!(isObject(current) && current.hasOwnProperty(key))) {
      return initial;
    }

    stack.push({ parent: current, key });
    current = current[key] as Record<string, any>;
  }

  const finalKey = keys[keys.length - 1];

  if (isObject(current) && current.hasOwnProperty(finalKey)) {
    delete current[finalKey];

    // Check and clean up empty parent objects
    while (stack.length > 0) {
      const { parent, key } = stack.pop()!;
      if (isObject(parent[key]) && Object.keys(parent[key]).length === 0) {
        delete parent[key];
      } else {
        break;
      }
    }
  }

  return initial;
};
