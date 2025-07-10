import { TravelMode } from "@/helpers/constants/travelMode";
import { Day, Role, Stop, Travel, TripStatus } from "@prisma/client";

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

export type DayWithStops = Day & {
  stops: Stop[];
};

type StopId = string;

export type TravelDetails = Record<
  StopId,
  {
    dayId?: string;
    originId?: string;
    duration: number;
    distance: number;
    cost: number;
    mode: TravelMode;
  }
>;

export type TravelWithDetails = Omit<Travel, "travels"> & {
  travels: Record<
    StopId,
    {
      details: {
        dayId?: string;
        originId?: string;
        duration: number;
        distance: number;
        cost: number;
        mode: TravelMode;
      };
      relationships: TravelDetails;
    }
  >;
};
