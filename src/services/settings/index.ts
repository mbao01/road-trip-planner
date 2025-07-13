import { UpdateTripSettingsArg } from "@/app/api/utilities/validation/schemas/trip";
import { prisma } from "@/lib/prisma";

/**
 * Updates settings for a trip
 * @param tripId - The ID of the trip
 * @param data - The data to update
 * @returns The updated settings
 */
export async function updateTripSettings(tripId: string, data: UpdateTripSettingsArg) {
  return prisma.settings.update({
    where: { tripId },
    data,
  });
}
