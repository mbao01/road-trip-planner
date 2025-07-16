"use client";

import { StopTypeIcon } from "@/components/stop-type-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DescriptionDetail,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { STOP_EVENT } from "@/helpers/constants/stopEvent";
import { NormalizedSettings } from "@/helpers/settings";
import { formatCurrency } from "@/utilities/numbers";
import { Stop, StopEvent } from "@prisma/client";
import { XIcon } from "lucide-react";

interface StopInfoWindowProps {
  stop: Stop;
  settings: NormalizedSettings;
  onClose: () => void;
}

export function StopInfoWindow({ stop, settings, onClose }: StopInfoWindowProps) {
  return (
    <Card className="w-80">
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle>{stop.name}</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 -translate-y-1" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
