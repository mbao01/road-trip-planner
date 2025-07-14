import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { dayRepo } from "@/repository/day";
import { travelRepo } from "@/repository/travel";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { googleService } from "../google";

/**
 * Gets the travel for a trip
 * @param tripId - The ID of the trip
 * @returns The travel for the trip
 */
const getTravel = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.VIEWER] },
  });

  const travel = await travelRepo.getTravel(tripId);

  return { travel };
};

/**
 * Creates the travel for a trip
 * @param tripId - The ID of the trip
 * @returns The created travel
 */
const createTravel = async ({ tripId }: { tripId: string }) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const days = await dayRepo.getDaysByTripId(tripId);

  if (!days) {
    throw new Error("Trip not found or you don't have access", {
      cause: { status: StatusCodes.NOT_FOUND },
    });
  }

  // TODO:: Add support for caching such that only places without a route matrix are fetched

  const stops = days.flatMap((day) => day.stops);
  const places = stops.map((stop) => stop.placeId);
  let travel = null;

  if (places.length === 0) {
    return { travel };
  }

  try {
    const { matrix } = await googleService.getRouteMatrix({
      origins: places,
      destinations: places,
    });

    if (matrix && matrix.length > 0) {
      travel = await travelRepo.updateTravel(tripId, matrix, stops);

      return { travel };
    }

    return { travel };
  } catch (error) {
    console.error(error || "Failed to get distance matrix");

    return { travel };
  }
};

export const travelService = {
  getTravel,
  createTravel,
};
