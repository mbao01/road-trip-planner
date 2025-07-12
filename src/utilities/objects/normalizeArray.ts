export const normalizeArray = <T>(arr: T[] | unknown, minLength: number, padValue = "") => {
  if (!Array.isArray(arr)) return arr;

  if (arr.length < minLength) {
    return arr.concat(Array(minLength - arr.length).fill(padValue));
  }

  return arr;
};
