import { getSettingsChildrenRoutes } from "./getSettingsRoute";
import { type GetPropertyRoleRouteArgs } from "./types";

export const getPropertyRoleRoute = ({ propertyId, roleId }: GetPropertyRoleRouteArgs) => {
  const { ROLE_MANAGEMENT_ROUTE } = getSettingsChildrenRoutes({ propertyId });
  return `${ROLE_MANAGEMENT_ROUTE}/${roleId}` as const;
};

export const getPropertyRoleChildrenRoutes = ({ propertyId, roleId }: GetPropertyRoleRouteArgs) => {
  const propertyRoleRoute = getPropertyRoleRoute({ propertyId, roleId });

  return {
    PROPERTY_ROLE_ROUTE: propertyRoleRoute,
  } as const;
};
