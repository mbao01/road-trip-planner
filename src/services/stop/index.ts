import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { dayRepo } from "@/repository/day";
import { stopRepo } from "@/repository/stop";
import { TripRole } from "@prisma/client";

const getStops = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const stops = await dayRepo.getStopsFromDays(tripId);

  return { stops };
};

export const deleteStop = async ({ tripId, stopId }: { tripId: string; stopId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  await stopRepo.deleteStopById(stopId);
};

export const stopService = {
  getStops,
  deleteStop,
};
