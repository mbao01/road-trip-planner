import { prisma } from "@/lib/prisma";
import { CreateItineraryArg, UpdateItineraryArg } from "@/lib/schemas/itinerary";

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

const createItinerary = async (data: CreateItineraryArg) => {
  return prisma.itinerary.create({
    data,
  });
};

const updateItinerary = async (
  itineraryId: string,
  data: Omit<UpdateItineraryArg, "itineraryId">
) => {
  return prisma.itinerary.update({
    where: { id: itineraryId },
    data,
  });
};

const deleteItinerary = async ({ itineraryId }: { itineraryId: string }) => {
  return prisma.itinerary.delete({
    where: { id: itineraryId },
  });
};

export const itineraryRepo = {
  updateItinerary,
  createItinerary,
  deleteItinerary,
  getItinerary,
  getItinerariesByStopId,
};
