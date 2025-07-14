import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import { AddStopArg, addStopSchema } from "@/app/api/utilities/validation/schemas/stop";
import { dayRepo } from "@/repository/day";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const getDays = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const days = await dayRepo.getDaysByTripId(tripId);

  return { days };
};

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
