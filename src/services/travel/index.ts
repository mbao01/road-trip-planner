import { prisma } from "@/lib/prisma";
import { Stop } from "@prisma/client";

type Matrix = {
  originIndex: number;
  destinationIndex: number;
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  condition: string;
};

/**
 * Gets the travel for a trip
 * @param tripId - The ID of the trip
 * @returns The travel for the trip
 */
export async function getTravel(tripId: string) {
  return prisma.travel.findFirst({
    where: {
      tripId,
    },
  });
}

/**
 * Updates the travel for a trip
 * @param tripId - The ID of the trip
 * @param matrix - The matrix of stops
 * @param stops - The stops for the trip
 * @returns The updated travel for the trip
 */
export async function updateTravel(tripId: string, matrix: Matrix[], stops: Stop[]) {
  const travels = matrix.reduce(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acc: any,
      datum: Matrix
    ) => {
      if (datum.originIndex !== datum.destinationIndex) {
        const { id: destinationId } = stops[datum.destinationIndex];
        const { id: originId } = stops[datum.originIndex];

        // stopId: { originId, distance, duration, etc}
        acc[destinationId] = acc[destinationId] || { relationships: {} };
        acc[destinationId] = {
          relationships: {
            ...acc[destinationId].relationships,
            [originId]: {
              originId,
              dayId: stops[datum.destinationIndex].dayId,
              distance: datum.distanceMeters,
              duration: Number(datum.duration.replace("s", "")),
              staticDuration: Number(datum.staticDuration.replace("s", "")),
              condition: datum.condition,
            },
          },
        };
      }

      return acc;
    },
    {}
  );

  stops.forEach((stop, index) => {
    const { id: stopId } = stop;
    const prevStopId = stops[index - 1]?.id;

    if (prevStopId) {
      travels[stopId] = {
        ...travels[stopId],
        details: travels[stopId]?.relationships?.[prevStopId],
      };
    }
  });

  const travel = await prisma.travel.upsert({
    where: {
      tripId,
    },
    create: {
      tripId,
      travels,
    },
    update: {
      travels,
    },
  });

  return travel;
}
