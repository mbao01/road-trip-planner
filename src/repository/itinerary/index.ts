import {
  CreateItineraryArg,
  UpdateItineraryArg,
} from "@/app/api/utilities/validation/schemas/itinerary";
import { prisma } from "@/lib/prisma";

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

const getItinerariesByTripId = async ({ tripId }: { tripId: string }) => {
  return prisma.itinerary.findMany({
    where: { tripId },
  });
};

const createItinerary = async ({ stopId, data }: { stopId: string; data: CreateItineraryArg }) => {
  return prisma.itinerary.create({
    data: {
      ...data,
      stop: {
        connect: { id: stopId },
      },
    },
  });
};

const updateItinerary = async ({
  itineraryId,
  data,
}: {
  itineraryId: string;
  data: UpdateItineraryArg;
}) => {
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
  getItinerariesByTripId,
};
