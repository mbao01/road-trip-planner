import { PropertyPermission } from "@/app/api/graphql/enums";
import { andPermissions } from "../helpers";
import { getPropertyChildrenRoutes } from "./getPropertyRoute";
import { getSettingsChildrenRoutes } from "./getSettingsRoute";

export const getPermissionSettingsRoutes = ({
  propertyId,
  permissions,
}: {
  propertyId: string;
  permissions?: Partial<Record<PropertyPermission, boolean>>;
}) => {
  const { OVERVIEW_ROUTE: ROOT_ROUTE } = getPropertyChildrenRoutes({ propertyId });
  const {
    OVERVIEW_ROUTE,
    DEFAULT_TARIFF_ROUTE,
    ROLE_MANAGEMENT_ROUTE,
    USER_MANAGEMENT_ROUTE,
    WALLET_MANAGEMENT_ROUTE,
  } = getSettingsChildrenRoutes({ propertyId });

  const routesMap = {
    [OVERVIEW_ROUTE]: {
      href: OVERVIEW_ROUTE,
      showItem: permissions?.propertyupdate,
    },
    [DEFAULT_TARIFF_ROUTE]: {
      href: DEFAULT_TARIFF_ROUTE,
      showItem: permissions?.meterupdate,
    },
    [ROLE_MANAGEMENT_ROUTE]: {
      href: ROLE_MANAGEMENT_ROUTE,
      showItem: andPermissions([
        permissions?.propertyrolelist,
        permissions?.propertypermissionlist,
        permissions?.propertyrolepermissionlist,
      ]),
    },

    [USER_MANAGEMENT_ROUTE]: {
      href: USER_MANAGEMENT_ROUTE,
      showItem: permissions?.propertyuserlist,
    },
    [WALLET_MANAGEMENT_ROUTE]: {
      href: WALLET_MANAGEMENT_ROUTE,
      showItem: permissions?.walletlist,
    },
  } as const;

  const [, navItem] = Object.entries(routesMap).find(([, { showItem }]) => showItem) ?? [
    undefined,
    { href: ROOT_ROUTE, showItem: false },
  ];

  return { routesMap, navItem };
};
