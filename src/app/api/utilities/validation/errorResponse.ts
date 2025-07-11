export const errorResponse = <T>(message: string, response?: T) => {
  return { success: false, message, errors: [], ...response } as const;
};
