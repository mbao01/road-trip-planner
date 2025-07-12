import { GetPropertyRouteArgs } from "./types";

export const getPropertyRoute = ({ propertyId }: GetPropertyRouteArgs) => {
  return `/${propertyId}` as const;
};

export const getPropertyChildrenRoutes = ({ propertyId }: GetPropertyRouteArgs) => {
  const propertyRoute = getPropertyRoute({ propertyId });

  return {
    AUDIT_TRAIL_ROUTE: `${propertyRoute}/records/audit-trail`,
    CUSTOMERS_ROUTE: `${propertyRoute}/customers`,
    METERS_ROUTE: `${propertyRoute}/meters`,
    OVERVIEW_ROUTE: propertyRoute,
    TARIFFS_ROUTE: `${propertyRoute}/tariffs`,
    TRANSACTIONS_ROUTE: `${propertyRoute}/transactions`,
    INTERMEDIATE_TRANSACTIONS_ROUTE: `${propertyRoute}/records/transactions`,
    SETTINGS_ROUTE: `${propertyRoute}/settings`,

    PERMISSIONS_API_ROUTE: `${propertyRoute}/permissions`,
  } as const;
};
