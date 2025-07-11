export const getUserRoute = () => {
  return "/user" as const;
};

export const getUserChildrenRoutes = () => {
  const userRoute = "/user" as const;

  return {
    PROFILE_ROUTE: userRoute,
    EDIT_PROFILE_ROUTE: `${userRoute}/edit`,
    SECURITY_ROUTE: `${userRoute}/security`,
    SETTINGS_ROUTE: `${userRoute}/settings`,
    CUSTOMER_SUPPORT_ROUTE: `${userRoute}/support`,
  } as const;
};
