export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please contact support.";

export const COMMON_ROUTES = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  SIGN_IN: "/sign-in",
  SIGN_OUT: "/sign-out",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

export const REDIRECT_TARGET_QUERY_KEY = "redirectTo";

export const REDIRECT_FALLBACK_ROUTE = `${COMMON_ROUTES.DASHBOARD}/properties`;
