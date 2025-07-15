import {
  CreateItineraryArg,
  DeleteItineraryArg,
  UpdateItineraryArg,
} from "@/lib/schemas/itinerary";
import { itineraryService } from "@/services/itinerary";

export async function addItineraryAction(values: CreateItineraryArg) {
  try {
    const itinerary = await itineraryService.createItinerary(values);

    return { itinerary, error: false };
  } catch (error) {
    return { error: ((error as any)?.message as string) || "Could not create itinerary" };
  }
}

export async function updateItineraryAction(values: UpdateItineraryArg) {
  try {
    const { itineraryId, ...data } = values;
    const itinerary = await itineraryService.updateItinerary({ itineraryId }, data);

    return { itinerary, error: false };
  } catch (error) {
    return { error: (error as any)?.message || "Could not update itinerary" };
  }
}

export async function deleteItineraryAction(values: DeleteItineraryArg) {
  const itinerary = await itineraryService.deleteItinerary(values);

  return itinerary;
}
