import { Itinerary } from "@prisma/client";
import { ItineraryForm } from "./itinerary-form";

export const StopItineraries = ({
  stopId,
  itineraries,
}: {
  stopId: string;
  itineraries: Itinerary[];
}) => {
  if (!itineraries || itineraries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {itineraries?.map((itinerary) => (
        <ItineraryForm key={itinerary.id} stopId={stopId} itinerary={itinerary} />
      ))}
    </div>
  );
};
