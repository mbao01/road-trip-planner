import { authGuard, Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { createTripSchema } from "@/app/api/utilities/validation/schemas";
import { ReorderDaysArg, reorderDaysSchema } from "@/app/api/utilities/validation/schemas/day";
import {
  CreateTripArg,
  UpdateTripArg,
  UpdateTripDetailsArg,
  updateTripDetailsSchema,
  updateTripSchema,
} from "@/app/api/utilities/validation/schemas/trip";
import { stopRepo } from "@/repository/stop";
import { tripRepo } from "@/repository/trip";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { travelService } from "../travel";

const getUserTrip = async ({ tripId }: { tripId: string }) => {
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const trip = await tripRepo.getUserTrip(session.user.id, tripId);

  if (!trip) {
    throw new Error("Trip not found or you don't have access", {
      cause: { status: StatusCodes.NOT_FOUND },
    });
  }

  if (!trip.travel && trip._count.stops > 1) {
    const { travel } = await travelService.createTravel({ tripId });
    trip.travel = travel;
  }

  return { trip };
};

const getUserTrips = async () => {
  const session = await authGuard();
  const trips = await tripRepo.getUserTrips(session.user.id);

  return { trips };
};

const createTrip = async (data: CreateTripArg) => {
  const session = await authGuard();

  const result = validator(data, createTripSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const { name, startDate, endDate, startStop } = result.data;

  const trip = await tripRepo.createTrip({
    name,
    startDate,
    endDate,
    ownerId: session.user.id,
    startStop,
  });

  return { trip };
};

const updateTrip = async ({ tripId }: { tripId: string }, data: UpdateTripArg) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const result = validator(data, updateTripSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const trip = await tripRepo.updateTripWithDays(tripId, result.data);

  return { trip };
};

const updateTripDetails = async ({ tripId }: { tripId: string }, data: UpdateTripDetailsArg) => {
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const result = validator(data, updateTripDetailsSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const trip = await tripRepo.updateTripDetails(session.user.id, tripId, result.data);

  return { trip };
};

const reorderTrip = async ({ tripId }: { tripId: string }, data: ReorderDaysArg) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const result = validator(data, reorderDaysSchema);
  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  await stopRepo.bulkUpdateStopsOrder(result.data);
};

const deleteTrip = async ({ tripId }: { tripId: string }) => {
  const session = await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.OWNER] },
  });

  await tripRepo.deleteTrip(session.user.id, tripId);
};

export const tripService = {
  getUserTrip,
  getUserTrips,
  createTrip,
  updateTrip,
  updateTripDetails,
  reorderTrip,
  deleteTrip,
};
