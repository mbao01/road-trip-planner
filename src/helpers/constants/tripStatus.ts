import { TripStatus } from "@prisma/client";

export const TRIP_STATUS = {
  [TripStatus.IN_PROGRESS]: "In Progress",
  [TripStatus.NOT_STARTED]: "Not Started",
  [TripStatus.COMPLETED]: "Completed",
  [TripStatus.ARCHIVED]: "Archived",
  [TripStatus.ACTIVE]: "Active",
  [TripStatus.DELETED]: "Deleted",
};
