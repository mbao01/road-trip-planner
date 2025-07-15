import {
  CreateItineraryArg,
  DeleteItineraryArg,
  UpdateItineraryArg,
} from "@/lib/schemas/itinerary";
import { itineraryService } from "@/services/itinerary";

export async function addItineraryAction(values: CreateItineraryArg) {
  const itinerary = await itineraryService.createItinerary(values);

  return itinerary;
}

export async function updateItineraryAction(values: UpdateItineraryArg) {
  const { itineraryId, ...data } = values;
  const itinerary = await itineraryService.updateItinerary({ itineraryId }, data);

  return itinerary;
}

export async function deleteItineraryAction(values: DeleteItineraryArg) {
  const itinerary = await itineraryService.deleteItinerary(values);

  return itinerary;
}
