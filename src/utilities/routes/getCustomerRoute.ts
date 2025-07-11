import { getPropertyChildrenRoutes } from "./getPropertyRoute";
import { type GetCustomerRouteArgs } from "./types";

export const getCustomerRoute = ({ customerId, propertyId }: GetCustomerRouteArgs) => {
  const customersRoute = getPropertyChildrenRoutes({
    propertyId,
  }).CUSTOMERS_ROUTE;

  return `${customersRoute}/${customerId}` as const;
};

export const getCustomerChildrenRoutes = ({ customerId, propertyId }: GetCustomerRouteArgs) => {
  const customerRoute = getCustomerRoute({ customerId, propertyId });

  return {
    CUSTOMER_OVERVIEW_ROUTE: customerRoute,
    CUSTOMER_UPDATE_ROUTE: `${customerRoute}/update`,
  } as const;
};
