import type { PropertyPermission } from "@/app/api/graphql/enums";

export const andPermissions = <T extends PropertyPermission>(
  permissions: Partial<Record<T, boolean>> | (boolean | undefined)[]
) => {
  return Object.values(permissions).every((enabled) => enabled);
};

export const orPermissions = <T extends PropertyPermission>(
  permissions: Partial<Record<T, boolean>> | (boolean | undefined)[]
) => {
  return Object.values(permissions).some((enabled) => Boolean(enabled));
};
