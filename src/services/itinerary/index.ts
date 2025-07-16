import { UpsertItineraryArg } from "@/lib/schemas/itinerary";
import { itineraryRepo } from "@/repository/itinerary";

const getItinerariesByStopId = async ({ stopId }: { stopId: string }) => {
  return itineraryRepo.getItinerariesByStopId({ stopId });
};

const upsertItinerary = async (data: UpsertItineraryArg) => {
  return itineraryRepo.upsertItinerary(data);
};

const deleteItinerary = async ({ itineraryId }: { itineraryId: string }) => {
  return itineraryRepo.deleteItinerary({ itineraryId });
};

export const itineraryService = {
  getItinerariesByStopId,
  upsertItinerary,
  deleteItinerary,
};
