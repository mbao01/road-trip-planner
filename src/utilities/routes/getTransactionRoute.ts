import { getPropertyChildrenRoutes } from "./getPropertyRoute";
import { type GetTransactionRouteArgs } from "./types";

export const getTransactionRoute = ({ paymentId, propertyId }: GetTransactionRouteArgs) => {
  const transactionsRoute = getPropertyChildrenRoutes({
    propertyId,
  }).TRANSACTIONS_ROUTE;

  return `${transactionsRoute}/${paymentId}` as const;
};

export const getTransactionChildrenRoutes = ({
  paymentId,
  propertyId,
}: GetTransactionRouteArgs) => {
  const transactionRoute = getTransactionRoute({ paymentId, propertyId });

  return {
    TRANSACTION_OVERVIEW_ROUTE: transactionRoute,
    TRANSACTION_TRAIL_ROUTE: `${transactionRoute}/trail`,
  } as const;
};
