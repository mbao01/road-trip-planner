import type { PublicTrip } from "@/types/trip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NormalizedSettings } from "@/helpers/settings";
import { ShareDayCard } from "./share-day-card";
import { ShareTripHeader } from "./share-trip-header";

interface ShareTripSidebarProps {
  trip: PublicTrip;
  settings: NormalizedSettings;
}

export function ShareTripSidebar({ trip, settings }: ShareTripSidebarProps) {
  let stopCounter = 0;
  return (
    <div className="flex flex-col h-full">
      <ShareTripHeader trip={trip} settings={settings} />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {trip.days.map((day, index) => {
            const offset = stopCounter;
            stopCounter += day.stops.length;

            return (
              <ShareDayCard
                key={day.id}
                day={day}
                dayIndex={index}
                travel={trip.travel}
                settings={settings}
                stopNumberOffset={offset}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
