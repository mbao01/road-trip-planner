export const sanitizeObject = <T>(input: T, keyRegex: RegExp, mask: string = "****"): unknown => {
  if (!input) return input;

  const data = JSON.parse(JSON.stringify(input)); // Simple deep copy

  const recursiveSanitize = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map((item) => recursiveSanitize(item));
    } else if (obj !== null && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj as Record<string, unknown>).map(([key, value]) => {
          if (new RegExp(keyRegex).test(key)) {
            return [key, mask];
          } else {
            return [key, recursiveSanitize(value)];
          }
        })
      );
    } else {
      return obj;
    }
  };

  return recursiveSanitize(data);
};
