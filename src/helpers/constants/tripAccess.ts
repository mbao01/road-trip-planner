import { Role } from "@prisma/client";

export const TRIP_ACCESS = {
  [Role.OWNER]: "Owner",
  [Role.EDITOR]: "Editor",
  [Role.VIEWER]: "Viewer",
  [Role.PUBLIC]: "Public",
};
