import { TripAccess, TripRole } from "@prisma/client";

export const TRIP_ACCESS = {
  [TripAccess.PUBLIC]: "Public",
  [TripAccess.PRIVATE]: "Private",
};

export const TRIP_ROLE = {
  [TripRole.OWNER]: "Owner",
  [TripRole.EDITOR]: "Editor",
  [TripRole.VIEWER]: "Viewer",
  [TripRole.PUBLIC]: "Public",
};
