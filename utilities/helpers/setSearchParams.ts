import dot from "dot-object";

export const setSearchParams = (path: string | URL, queryParams: Record<string, any>) => {
  const url = new URL(path, "https://etrackbase.com");
  const searchParams = new URLSearchParams(dot.dot(queryParams));
  searchParams.forEach((value, key) => {
    if (value === "" || value === undefined || value === null || value === "undefined") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  const search = url.searchParams.toString();

  return search ? `${url.pathname}?${search}` : url.pathname;
};
