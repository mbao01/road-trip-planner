import { prisma } from "@/lib/prisma";
import { Stop } from "@prisma/client";

export async function getDaysWithStopsForTrip(tripId: string) {
  return prisma.day.findMany({
    where: { tripId },
    include: {
      stops: { orderBy: { order: "asc" } },
    },
    orderBy: { date: "asc" },
  });
}

type Matrix = {
  originIndex: number;
  destinationIndex: number;
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  condition: string;
};

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

export async function findFirstTravel(where: any) {
  return prisma.travel.findFirst({ where });
}
