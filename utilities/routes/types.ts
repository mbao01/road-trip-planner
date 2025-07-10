export type GetCustomerRouteArgs = {
  customerId: string | null | undefined;
  propertyId: string;
};

export type GetPropertyRouteArgs = {
  propertyId: string;
};

export type GetPropertyRoleRouteArgs = {
  propertyId: string;
  roleId: string | null | undefined;
};

export type GetMeterRouteArgs = {
  meterCode: string;
  propertyId: string;
};

export type GetSettingsRouteArgs = {
  propertyId: string;
};

export type GetTransactionRouteArgs = {
  paymentId: string;
  propertyId: string;
};
