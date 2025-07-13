import { prisma } from "@/lib/prisma";

export async function getDaysStops(tripId: string) {
  return prisma.day.findMany({
    where: { tripId },
    orderBy: { date: "asc" },
    include: {
      stops: { orderBy: { order: "asc" } },
    },
  });
}

export async function addStopToDay(dayId: string, stopData: any) {
  // Get the day and count stops
  const day = await prisma.day.findUnique({
    where: { id: dayId },
    include: { _count: { select: { stops: true } } },
  });
  if (!day) throw new Error("Day not found");
  // Create the stop
  const newStop = await prisma.stop.create({
    data: {
      ...stopData,
      dayId: dayId,
      tripId: day.tripId,
      order: day._count.stops,
    },
  });
  return newStop;
}

export async function deleteDayById(dayId: string) {
  return prisma.day.delete({ where: { id: dayId } });
}
