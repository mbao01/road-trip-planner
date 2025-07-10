import { getPropertyChildrenRoutes } from "./getPropertyRoute";
import { type GetMeterRouteArgs } from "./types";

export const getMeterRoute = ({ meterCode, propertyId }: GetMeterRouteArgs) => {
  const metersRoute = getPropertyChildrenRoutes({ propertyId }).METERS_ROUTE;

  return `${metersRoute}/${meterCode}` as const;
};

export const getMeterChildrenRoutes = ({ meterCode, propertyId }: GetMeterRouteArgs) => {
  const meterRoute = getMeterRoute({ meterCode, propertyId });

  return {
    METER_OVERVIEW_ROUTE: meterRoute,
    METER_ADD_DEBT_ROUTE: `${meterRoute}/debt`,
    METER_ADD_SCHEDULED_DEBT_ROUTE: `${meterRoute}/scheduled-debt`,
    METER_UPDATE_ROUTE: `${meterRoute}/update`,
    ASSIGN_METER_TO_CUSTOMER_ROUTE: `${meterRoute}/assign-customer`,
  } as const;
};
