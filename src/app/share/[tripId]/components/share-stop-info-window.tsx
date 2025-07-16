"use client"

import type { Stop } from "@/types/trip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StopTypeIcon } from "@/components/stop-type-icon"
import { formatCurrency } from "@/utilities/numbers"
import { AdvancedMarker } from "@vis.gl/react-google-maps"

interface ShareStopInfoWindowProps {
  stop: Stop
  onCloseClick: () => void
}

export function ShareStopInfoWindow({ stop, onCloseClick }: ShareStopInfoWindowProps) {
  return (
    <AdvancedMarker position={{ lat: stop.latitude, lng: stop.longitude }}>
      <Card className="w-80">
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle>{stop.name}</CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 -translate-y-1" onClick={onCloseClick}>
            <XIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <StopTypeIcon stopEvent={stop.stopEvent} className="mr-2 h-4 w-4" />
            <span>{stop.stopEvent}</span>
          </div>
          {stop.cost ? (
            <p className="text-sm">
              <strong>Cost:</strong> {formatCurrency(stop.cost)}
            </p>
          ) : null}
          {stop.notes ? (
            <div className="text-sm">
              <strong>Notes:</strong>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{stop.notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </AdvancedMarker>
  )
}
