import { prisma } from "@/lib/prisma";
import { UpsertItineraryArg } from "@/lib/schemas/itinerary";

const getItinerary = async ({ itineraryId }: { itineraryId: string }) => {
  return prisma.itinerary.findUnique({
    where: { id: itineraryId },
  });
};

const getItinerariesByStopId = async ({ stopId }: { stopId: string }) => {
  return prisma.itinerary.findMany({
    where: { stopId },
  });
};

const upsertItinerary = async (data: UpsertItineraryArg) => {
  return prisma.itinerary.upsert({
    where: { id: data.id },
    create: data,
    update: data,
  });
};

const deleteItinerary = async ({ itineraryId }: { itineraryId: string }) => {
  return prisma.itinerary.delete({
    where: { id: itineraryId },
  });
};

export const itineraryRepo = {
  upsertItinerary,
  deleteItinerary,
  getItinerary,
  getItinerariesByStopId,
};
