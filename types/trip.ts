import { Currency, Day, DistanceUnit, Role, Stop, Travel, TripStatus } from "@prisma/client";

// Type for the data displayed in the trips table
export type TripTableRow = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  dayCount: number;
  stopCount: number;
  status: TripStatus;
  access: Role;
};

export type StopWithTravel = Stop & {
  travel?: Travel;
};

export type DayWithStopsWithTravel = Day & {
  stops: StopWithTravel[];
};
