export const getFulfilledResponse = <T>(
  promise: PromiseSettledResult<T> | undefined,
  fallback: Record<string, any> = {}
) => {
  if (promise?.status === "fulfilled") {
    return promise.value;
  }
  return fallback;
};
