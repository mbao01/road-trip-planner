import { CreateItineraryArg, UpdateItineraryArg } from "@/lib/schemas/itinerary";
import { itineraryRepo } from "@/repository/itinerary";

const getItinerariesByStopId = async ({ stopId }: { stopId: string }) => {
  return itineraryRepo.getItinerariesByStopId({ stopId });
};

const createItinerary = async (data: CreateItineraryArg) => {
  return itineraryRepo.createItinerary(data);
};

const updateItinerary = async (
  { itineraryId }: { itineraryId: string },
  data: Omit<UpdateItineraryArg, "itineraryId">
) => {
  return itineraryRepo.updateItinerary(itineraryId, data);
};

const deleteItinerary = async ({ itineraryId }: { itineraryId: string }) => {
  return itineraryRepo.deleteItinerary({ itineraryId });
};

export const itineraryService = {
  getItinerariesByStopId,
  createItinerary,
  updateItinerary,
  deleteItinerary,
};
