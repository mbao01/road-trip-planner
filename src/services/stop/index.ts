import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { UpdateStopArg, updateStopSchema } from "@/app/api/utilities/validation/schemas/stop";
import { UpdateTripArg } from "@/app/api/utilities/validation/schemas/trip";
import { dayRepo } from "@/repository/day";
import { stopRepo } from "@/repository/stop";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

/**
 * Gets stops for a trip
 * @param tripId - The ID of the trip
 * @returns The stops for the trip
 */
const getStops = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const stops = await dayRepo.getStopsFromDays(tripId);

  return { stops };
};

/**
 * Update stop detail
 * @param tripId - The ID of the trip
 * @param stopId - The ID of the stop
 * @returns The deleted stop
 */
const updateStop = async (
  { tripId, stopId }: { tripId: string; stopId: string },
  data: UpdateStopArg
) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const result = validator(data, updateStopSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const stop = await stopRepo.updateStop(stopId, result.data);

  return { stop };
};

/**
 * Deletes a stop
 * @param tripId - The ID of the trip
 * @param stopId - The ID of the stop
 * @returns The deleted stop
 */
const deleteStop = async ({ tripId, stopId }: { tripId: string; stopId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  await stopRepo.deleteStopById(stopId);
};

export const stopService = {
  getStops,
  updateStop,
  deleteStop,
};
