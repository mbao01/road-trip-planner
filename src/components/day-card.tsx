"use client";

import type { PlaceDetails } from "@/lib/google-maps-api";
import type { FC } from "react";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { NormalizedSettings } from "@/helpers/settings";
import { StopWithItineraries } from "@/types/trip";
import { formatDate } from "@/utilities/dates";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Day, Travel } from "@prisma/client";
import { ArrowDown, ArrowUp, MoreVertical, Trash2 } from "lucide-react";
import { AddStop } from "./add-stop";
import { StopCard } from "./stop-card";

interface DayCardProps {
  day: Day;
  travel: Travel | null;
  stops: StopWithItineraries[];
  dayIndex: number;
  totalDays: number;
  stopNumberOffset: number;
  onMoveDay: (dayId: Day["id"], direction: "up" | "down") => void;
  onDeleteDay: () => void;
  onAddStop: (dayId: Day["id"], location: PlaceDetails) => void;
  onUpdateStop: (
    dayId: Day["id"],
    stopId: StopWithItineraries["id"],
    data: Partial<Pick<StopWithItineraries, "stopEvent" | "stopCost" | "customName">>
  ) => void;
  onDeleteStop: (dayId: Day["id"], stopId: StopWithItineraries["id"]) => void;
  settings: NormalizedSettings;
}

export const DayCard: FC<DayCardProps> = ({
  day,
  travel,
  stops,
  dayIndex,
  totalDays,
  stopNumberOffset,
  onMoveDay,
  onDeleteDay,
  onAddStop,
  onUpdateStop,
  onDeleteStop,
  settings,
}) => {
  const { setNodeRef } = useDroppable({
    id: `day-${day.id}`,
    data: { type: "day", day: day },
  });

  const details = useMemo(() => {
    const { display } = calculateTravelDetails("day", travel, settings, day.id);
    return display;
  }, [travel, settings, day]);

  return (
    <Card ref={setNodeRef} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold">Day {dayIndex + 1}</h3>
          <span className="text-sm text-muted-foreground truncate">
            {formatDate(day.date, "EEE, dd MMM")}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dayIndex > 0 && (
              <DropdownMenuItem onClick={() => onMoveDay(day.id, "up")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                <span>Move day up</span>
              </DropdownMenuItem>
            )}
            {dayIndex < totalDays - 1 && (
              <DropdownMenuItem onClick={() => onMoveDay(day.id, "down")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                <span>Move day down</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={onDeleteDay}
              className="text-red-500"
              disabled={totalDays <= 1}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete day</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <div className="inline-block max-w-full px-3 py-1 bg-gray-100 rounded-full text-xs text-muted-foreground truncate">
          {details}
        </div>
      </div>

      <SortableContext
        items={stops.map((stop) => `stop-${stop.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              dayId={day.id}
              travel={travel}
              settings={settings}
              stopNumber={stopNumberOffset + index + 1}
              onUpdateStop={onUpdateStop}
              onDeleteStop={onDeleteStop}
              isFirstStopOfTrip={dayIndex === 0 && index === 0}
            />
          ))}
        </div>
      </SortableContext>

      <div className="mt-4">
        <AddStop dayId={day.id} onAddStop={onAddStop} />
      </div>
    </Card>
  );
};
