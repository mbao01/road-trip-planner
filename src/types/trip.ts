import { TravelMode } from "@/app/api/utilities/validation/enums";
import {
  Collaborator,
  Day,
  Settings,
  Stop,
  Travel,
  Trip,
  TripAccess,
  TripStatus,
  User,
} from "@prisma/client";

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

export type CollaboratorWithUser = Collaborator & {
  user: Pick<User, "id" | "name" | "email" | "image">;
};

export type UserTrip = Omit<Trip, "ownerId"> &
  Partial<Pick<Trip, "ownerId">> & {
    days: DayWithStops[];
    collaborators: CollaboratorWithUser[];
    collaboratorsCount: number;
    dayCount: number;
    stopCount: number;
    travel: Travel; // TODO:: this is possibly undefined when fetching all trips
    settings: Settings; // TODO:: this is possibly undefined when fetching all trips
  };

export type UserTrips = Omit<UserTrip, "travel" | "settings">[];

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
