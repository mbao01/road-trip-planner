import { Itinerary } from "@prisma/client";
import { ItineraryCreateForm } from "./itinerary-create-form";
import { ItineraryUpdateForm } from "./itinerary-update-form";

export const StopItineraries = ({
  stopId,
  itineraries,
}: {
  stopId: string;
  itineraries: Itinerary[];
}) => {
  return (
    <div className="space-y-2">
      {itineraries?.map((itinerary) => (
        <ItineraryUpdateForm key={itinerary.id} stopId={stopId} itinerary={itinerary} />
      ))}

      <ItineraryCreateForm stopId={stopId} />
    </div>
  );
};
