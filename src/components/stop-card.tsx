"use client";

import type { Day, Travel } from "@prisma/client";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateTravelDetails } from "@/helpers/calculateTravelDetails";
import { STOP_EVENT } from "@/helpers/constants/stopEvent";
import { NormalizedSettings } from "@/helpers/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { StopWithItineraries } from "@/types/trip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StopEvent } from "@prisma/client";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLinkIcon,
  GripVertical,
  Trash2,
} from "lucide-react";
import { StopItineraries } from "./stop-itineraries";
import { STOP_TYPES, StopTypeIcon } from "./stop-type-icon";
import { TravelDetails } from "./travel-details";

interface StopCardProps {
  stop: StopWithItineraries;
  travel: Travel | null;
  dayId: Day["id"];
  settings: NormalizedSettings;
  stopNumber: number;
  onUpdateStop: (
    dayId: Day["id"],
    stopId: StopWithItineraries["id"],
    data: Partial<Pick<StopWithItineraries, "stopEvent" | "stopCost" | "customName">>
  ) => void;
  onDeleteStop: (dayId: Day["id"], stopId: StopWithItineraries["id"]) => void;
  isFirstStopOfTrip: boolean;
}

export const StopCard: FC<StopCardProps> = ({
  stop,
  travel,
  dayId,
  settings,
  stopNumber,
  onUpdateStop,
  onDeleteStop,
  isFirstStopOfTrip,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<StopEvent>(StopEvent.DEFAULT);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `stop-${stop.id}`,
    data: {
      type: "stop",
      stop: stop,
      dayId: dayId,
    },
  });

  const handleStopDetailsChange = useDebouncedCallback((data) => {
    onUpdateStop(dayId, stop.id, data);
  }, 300);

  const details = useMemo(() => {
    const { display } = calculateTravelDetails("stop", travel, settings, stop.id);
    return display;
  }, [travel, settings, stop]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  // The first stop of the entire trip has no driving details before it.
  const showDrivingDetails = !isFirstStopOfTrip;

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
      {showDrivingDetails && <TravelDetails details={details} />}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border rounded-lg bg-background">
          <div className="flex items-center gap-1 p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-grab"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <button className="flex-1 flex items-center gap-2 text-left min-w-0">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-medium shrink-0">
                  {stopNumber}
                </div>
                <span className="font-medium flex-1 truncate">{stop.name}</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDeleteStop(dayId, stop.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-4">
              <div className="flex gap-2">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <span className="px-3 py-2 bg-gray-100 border-r text-sm font-medium text-muted-foreground">
                    £
                  </span>
                  <Input
                    type="text"
                    defaultValue={stop.stopCost ?? ""}
                    onChange={(e) => handleStopDetailsChange({ stopCost: e.target.value })}
                    className="px-3 py-2 w-24 text-sm border-0 rounded-none focus:outline-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal bg-transparent"
                  >
                    <div className="flex items-center gap-2">
                      <StopTypeIcon value={selectedType} />
                      <span>{STOP_EVENT[selectedType]}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {STOP_TYPES.map(({ value }) => (
                    <DropdownMenuItem
                      key={value}
                      onSelect={() => {
                        setSelectedType(value);
                        onUpdateStop(dayId, stop.id, { stopEvent: value });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <StopTypeIcon value={value} />
                        <span>{STOP_EVENT[value]}</span>
                      </div>
                      {selectedType === value && <Check className="w-4 h-4 ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="space-y-2">
                <Label htmlFor={`custom-name-${stop.id}`} className="text-sm font-medium">
                  Custom stop name
                </Label>
                <Input
                  id={`custom-name-${stop.id}`}
                  className="w-full"
                  placeholder="Enter custom name"
                  defaultValue={stop.customName ?? ""}
                  onChange={(e) => handleStopDetailsChange({ customName: e.target.value })}
                />
              </div>
              <StopItineraries stopId={stop.id} itineraries={stop.itinerary} />
              <Button type="button" variant="link" className="w-full bg-transparent justify-center">
                <ExternalLinkIcon className="w-4 h-4" />
                Open in Google Maps
              </Button>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};
