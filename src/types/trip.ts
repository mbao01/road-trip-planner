import { TravelMode } from "@/app/api/utilities/validation/enums";
import { Collaborator, Day, Stop, Travel, Trip, TripAccess, TripStatus } from "@prisma/client";

// Type for the data displayed in the trips table
export type TripTableRow = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  dayCount: number;
  stopCount: number;
  status: TripStatus;
  access: TripAccess;
};

export type UserTrip = Omit<Trip, "ownerId"> & {
  collaborators: [Collaborator];
  collaboratorsCount: number;
  dayCount: number;
  stopCount: number;
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
