export const unslug = (input: string | null | undefined) => {
  if (!input) return input;

  return input.replace(/[-_]+/g, " ");
};
