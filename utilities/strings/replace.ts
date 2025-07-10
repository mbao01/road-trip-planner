export const replace = (
  string: string | undefined | null,
  searchValue: string,
  replaceValue: string = " "
) => {
  if (!string) return string;
  return string.replaceAll(searchValue, replaceValue);
};
