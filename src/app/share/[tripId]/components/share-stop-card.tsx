import type { PublicTrip } from "@/types/trip";
import { OpenInGoogleMaps } from "@/components/open-in-google-maps";
import { StopTypeIcon } from "@/components/stop-type-icon";
import { TravelDetails } from "@/components/travel-details";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DescriptionDetail,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { STOP_EVENT } from "@/helpers/constants/stopEvent";
import { NormalizedSettings } from "@/helpers/settings";
import { formatCurrency } from "@/utilities/numbers";
import { StopEvent } from "@prisma/client";
import { FileTextIcon } from "lucide-react";

interface ShareStopCardProps {
  stop: PublicTrip["days"][number]["stops"][number];
  stopNumber: number;
  travel: PublicTrip["travel"];
  settings: NormalizedSettings;
  isFirstStopOfTrip?: boolean;
}

export function ShareStopCard({
  stop,
  stopNumber,
  travel,
  settings,
  isFirstStopOfTrip,
}: ShareStopCardProps) {
  const { display: details } = calculateTravelDetails("stop", travel, settings, stop.id);
  const showDrivingDetails = !isFirstStopOfTrip;

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-bold">
            {stopNumber}
          </div>
          {stop.customName ?? stop.name}
        </CardTitle>
        <CardDescription>
          {showDrivingDetails && <TravelDetails details={details} />}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <DescriptionList>
          <DescriptionItem>
            <DescriptionTerm>Plan</DescriptionTerm>
            <DescriptionDetail>
              <div className="flex items-center text-muted-foreground">
                <StopTypeIcon
                  value={stop.stopEvent ?? StopEvent.DEFAULT}
                  className="mr-2 h-4 w-4"
                />
                <span>{STOP_EVENT[stop.stopEvent ?? StopEvent.DEFAULT]}</span>
              </div>
            </DescriptionDetail>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Cost</DescriptionTerm>
            <DescriptionDetail>
              {formatCurrency(stop.stopCost ?? 0, { currency: settings.currency })}
            </DescriptionDetail>
          </DescriptionItem>
        </DescriptionList>
        {stop.itinerary?.[0]?.notes && (
          <div className="flex items-start">
            <FileTextIcon className="mr-2 h-4 w-4 mt-0.5" />
            <p className="whitespace-pre-wrap text-muted-foreground">
              {stop.itinerary?.[0]?.notes}
            </p>
          </div>
        )}
        <OpenInGoogleMaps placeId={stop.placeId} />
      </CardContent>
    </Card>
  );
}
