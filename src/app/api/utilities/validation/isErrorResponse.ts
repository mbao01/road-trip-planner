import { type ErrorResponse } from "@/types/error";

export const isErrorResponse = <T>(response: T | ErrorResponse): response is ErrorResponse => {
  return Boolean(response && (response as ErrorResponse)?.errors);
};
