import { prisma } from "@/lib/prisma";

export async function deleteStopById(stopId: string) {
  return prisma.stop.delete({ where: { id: stopId } });
}

export async function getStopsForTrip(tripId: string) {
  const days = await prisma.day.findMany({
    where: { tripId },
    orderBy: { date: "asc" },
    include: { stops: { orderBy: { order: "asc" } } },
  });
  return days?.flatMap((day) => day.stops) || [];
}

export async function bulkUpdateStopsOrder(
  updatedDays: {
    id: string;
    date: string;
    stops: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[];
  }[]
) {
  const transaction = updatedDays.flatMap((day, dayIndex) => {
    const dayUpdate = prisma.day.update({
      where: { id: day.id },
      data: { order: dayIndex, date: day.date },
    });
    const stopUpdates = day.stops.map((stop, stopIndex) =>
      prisma.stop.update({
        where: { id: stop.id },
        data: { order: stopIndex, dayId: day.id },
      })
    );
    return [dayUpdate, ...stopUpdates];
  });
  return prisma.$transaction(transaction);
}
