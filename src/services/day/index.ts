import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { AddStopArg, addStopSchema } from "@/app/api/utilities/validation/schemas/stop";
import { dayRepo } from "@/repository/day";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

/**
 * Gets days for a trip
 * @param tripId - The ID of the trip
 * @returns The days for the trip
 */
const getDays = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const days = await dayRepo.getDaysByTripId(tripId);

  return { days };
};

/**
 * Creates a stop for a day
 * @param dayId - The ID of the day
 * @param tripId - The ID of the trip
 * @param data - The data to create the stop with
 * @returns The created stop
 */
const createDayStop = async (
  { dayId, tripId }: { dayId: string; tripId: string },
  data: AddStopArg
) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const result = validator(data, addStopSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const stop = await dayRepo.addStopToDay(dayId, result.data);

  return { stop };
};

/**
 * Deletes a day
 * @param dayId - The ID of the day
 * @param tripId - The ID of the trip
 * @returns The deleted day
 */
const deleteDay = async ({ dayId, tripId }: { dayId: string; tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  // TODO:: confirm that prisma's cascading delete on the schema will handle deleting the stops
  await dayRepo.deleteDayById(dayId);
};

export const dayService = {
  getDays,
  createDayStop,
  deleteDay,
};
