import { DeleteItineraryArg, UpsertItineraryArg } from "@/lib/schemas/itinerary";
import { itineraryService } from "@/services/itinerary";

export async function upsertItineraryAction(values: UpsertItineraryArg) {
  try {
    const itinerary = await itineraryService.upsertItinerary(values);

    return { itinerary, error: false };
  } catch (error) {
    return {
      error: ((error as { message: string })?.message as string) || "Could not create itinerary",
    };
  }
}

export async function deleteItineraryAction(values: DeleteItineraryArg) {
  const itinerary = await itineraryService.deleteItinerary(values);

  return itinerary;
}
