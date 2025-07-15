import { AddStopArg } from "@/app/api/utilities/validation/schemas/stop";
import { prisma } from "@/lib/prisma";

/**
 * Gets days by trip ID
 * @param tripId - The ID of the trip
 * @returns The days for the trip
 */
async function getDaysByTripId(tripId: string) {
  return prisma.day.findMany({
    where: { tripId },
    orderBy: { date: "asc" },
    include: {
      stops: { orderBy: { order: "asc" }, include: { itinerary: true } },
    },
  });
}

/**
 * Gets stops from days
 * @param tripId - The ID of the trip
 * @returns The stops for the trip
 */
async function getStopsFromDays(tripId: string) {
  const days = await prisma.day.findMany({
    where: { tripId },
    orderBy: { date: "asc" },
    include: { stops: { orderBy: { order: "asc" }, include: { itinerary: true } } },
  });
  return days?.flatMap((day) => day.stops) || [];
}

/**
 * Adds a stop to a day
 * @param dayId - The ID of the day
 * @param stopData - The data for the stop
 * @returns The new stop
 */
async function addStopToDay(dayId: string, stopData: AddStopArg) {
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

/**
 * Deletes a day by ID
 * @param dayId - The ID of the day
 * @returns The deleted day
 */
async function deleteDayById(dayId: string) {
  return prisma.day.delete({ where: { id: dayId } });
}

export const dayRepo = {
  getDaysByTripId,
  getStopsFromDays,
  addStopToDay,
  deleteDayById,
};
