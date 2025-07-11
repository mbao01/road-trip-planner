import { redirect } from "next/navigation";
import { type ErrorResponse } from "@/types/error";
import { COMMON_ROUTES } from "@/utilities/constants";

export const createErrorResponse = (...errors: string[]): ErrorResponse => {
  if (errors.some((message) => message.startsWith("Invalid token"))) {
    redirect(COMMON_ROUTES.SIGN_OUT);
  }
  return { errors };
};
