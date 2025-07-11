export const isPromiseFulfilled = <T>(result: PromiseSettledResult<Awaited<T>>) => {
  return result.status === "fulfilled" ? result.value : ({} as Partial<T>);
};
