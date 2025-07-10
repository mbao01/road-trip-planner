import { type GetSettingsRouteArgs } from "./types";

export const getSettingsRoute = ({ propertyId }: GetSettingsRouteArgs) => {
  return `/${propertyId}/settings` as const;
};

export const getSettingsChildrenRoutes = ({ propertyId }: GetSettingsRouteArgs) => {
  const settingsRoute = getSettingsRoute({ propertyId });

  return {
    OVERVIEW_ROUTE: settingsRoute,
    DEFAULT_TARIFF_ROUTE: `${settingsRoute}/tariff`,
    ROLE_MANAGEMENT_ROUTE: `${settingsRoute}/roles`,
    USER_MANAGEMENT_ROUTE: `${settingsRoute}/users`,
    ADD_USER_ROUTE: `${settingsRoute}/users/add`,
    WALLET_MANAGEMENT_ROUTE: `${settingsRoute}/wallets`,
    NOTIFICATIONS_ROUTE: `${settingsRoute}/notifications`,
  } as const;
};
