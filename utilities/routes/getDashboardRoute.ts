import { COMMON_ROUTES } from "../constants";

export const getDashboardRoute = () => {
  return COMMON_ROUTES.DASHBOARD;
};

export const getDashboardChildrenRoutes = () => {
  const dashboardRoute = getDashboardRoute();

  return {
    ALL_TRANSACTIONS_ROUTE: `${dashboardRoute}/transactions`,
    ALL_PROPERTIES_ROUTE: `${dashboardRoute}/properties`,
    CREATE_PROPERTY_ROUTE: `${dashboardRoute}/properties/create`,
    SEARCH_ROUTE: `${dashboardRoute}/search`,
  } as const;
};
