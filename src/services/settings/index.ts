import { prisma } from "@/lib/prisma";

export async function updateSettingsForTrip(tripId: string, data: any) {
  return prisma.settings.update({
    where: { tripId },
    data,
  });
}
