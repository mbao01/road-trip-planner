export const successResponse = <T>(message: string, response: T) => {
  return { success: true, message, ...response } as const;
};
