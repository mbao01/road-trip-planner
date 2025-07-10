export const sortBy = <T>(
  arr: T[] | undefined,
  property: keyof T,
  dir: "asc" | "desc" = "desc"
) => {
  return (arr ?? []).sort((a, b) => {
    let valA = property ? a[property] : a;
    let valB = property ? b[property] : b;

    // Convert strings to lowercase for case-insensitive sort
    if (typeof valA === "string") valA = valA.toLowerCase() as T[keyof T];
    if (typeof valB === "string") valB = valB.toLowerCase() as T[keyof T];

    if (valA < valB) return dir === "asc" ? -1 : 1;
    if (valA > valB) return dir === "asc" ? 1 : -1;
    return 0;
  });
};
