import type { PublicTrip } from "@/types/trip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { NormalizedSettings } from "@/helpers/settings";
import { formatDate } from "@/utilities/dates";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { MaximizeIcon } from "lucide-react";
import { ShareStopCard } from "./share-stop-card";

interface ShareDayCardProps {
  day: PublicTrip["days"][number];
  travel: PublicTrip["travel"];
  settings: NormalizedSettings;
  stopNumberOffset: number;
  dayIndex: number;
}

export function ShareDayCard({
  day,
  dayIndex,
  stopNumberOffset,
  travel,
  settings,
}: ShareDayCardProps) {
  const { display: details } = calculateTravelDetails("day", travel, settings, day.id);
  const stopsDetail =
    day.stops.length === 0
      ? "No stop"
      : day.stops.length === 1
        ? "1 stop"
        : `${day.stops.length} stops`;

  return (
    <Collapsible defaultOpen={dayIndex === 0}>
      <Card>
        <CardHeader className="relative gap-2">
          <CollapsibleTrigger asChild>
            <div className="absolute right-[5px] top-1">
              <TooltipProvider>
                <Tooltip defaultOpen={false}>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-4 w-4 hover:bg-background">
                      <MaximizeIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent>Click to show or hide Day stops</TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CollapsibleTrigger>
          <CardTitle className="flex justify-between items-center">
            <span>Day {dayIndex + 1}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {formatDate(day.date, "PPP")}
            </span>
          </CardTitle>
          <CardDescription className="flex justify-between items-center gap-2">
            <span className="inline-block max-w-full px-3 py-1 bg-background rounded-full text-xs text-muted-foreground truncate">
              {details}
            </span>
            <span className="inline-block max-w-full px-3 py-1 bg-background rounded-full text-xs text-muted-foreground truncate">
              {stopsDetail}
            </span>
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 px-4">
            {day.stops.map((stop, stopIndex) => (
              <ShareStopCard
                key={stop.id}
                stop={stop}
                stopNumber={stopNumberOffset + stopIndex + 1}
                travel={travel}
                settings={settings}
                isFirstStopOfTrip={dayIndex === 0 && stopIndex === 0}
              />
            ))}
            {day.stops.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No stops for this day.
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
