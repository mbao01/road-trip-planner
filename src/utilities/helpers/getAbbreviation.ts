export const getAbbreviation = (str: string | undefined) => {
  if (!str) return "";

  const [first, second] = str.split(" ").map((item) => item.trim());

  if (first && second) {
    return `${first[0]}${second[0]}`.toUpperCase();
  }

  return first ? first.slice(0, 2).toUpperCase() : second.slice(0, 2).toUpperCase();
};
