import {
  CreateItineraryArg,
  UpdateItineraryArg,
} from "@/app/api/utilities/validation/schemas/itinerary";
import { itineraryRepo } from "@/repository/itinerary";

const getItinerariesByStopId = async ({ stopId }: { stopId: string }) => {
  return itineraryRepo.getItinerariesByStopId({ stopId });
};

const createItinerary = async ({ stopId, data }: { stopId: string; data: CreateItineraryArg }) => {
  return itineraryRepo.createItinerary({ stopId, data });
};

const updateItinerary = async ({
  itineraryId,
  data,
}: {
  itineraryId: string;
  data: UpdateItineraryArg;
}) => {
  return itineraryRepo.updateItinerary({ itineraryId, data });
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
