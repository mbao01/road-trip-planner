export const isObject = (obj: unknown): obj is Record<string, any> => {
  return obj !== null && typeof obj === "object" && Array.isArray(obj) === false;
};
