import { ReorderDaysArg } from "@/app/api/utilities/validation/schemas/day";
import { prisma } from "@/lib/prisma";

/**
 * Gets stops by trip ID
 * @param tripId - The ID of the trip
 * @returns The stops for the trip
 */
async function getStopsByTripId(tripId: string) {
  return prisma.stop.findMany({
    where: { tripId },
  });
}

/**
 * Bulk updates the order of stops for a trip
 * @param updatedDays - The updated days with their stops
 * @returns The updated stops
 */
async function bulkUpdateStopsOrder(updatedDays: ReorderDaysArg) {
  const transaction = updatedDays.flatMap((day, dayIndex) => {
    const dayUpdate = prisma.day.update({
      where: { id: day.id },
      data: { order: dayIndex, date: day.date },
    });
    // TODO:: Do you need to reorder stops when you reorder days???
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

/**
 * Deletes a stop by ID
 * @param stopId - The ID of the stop
 * @returns The deleted stop
 */
async function deleteStopById(stopId: string) {
  return prisma.stop.delete({ where: { id: stopId } });
}

export const stopRepo = {
  getStopsByTripId,
  bulkUpdateStopsOrder,
  deleteStopById,
};
