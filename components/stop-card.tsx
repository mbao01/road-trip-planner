"use client";

import type { StopWithTravel } from "@/types/trip";
import type { Day, Settings, Stop } from "@prisma/client";
import type { FC } from "react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { formatTravelDetails } from "@/helpers/formatTravelDetails";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CameraIcon,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Fuel,
  GripVertical,
  Moon,
  Trash2,
  TreePine,
  Utensils,
} from "lucide-react";
import { TravelDetails } from "./travel-details";

interface StopCardProps {
  stop: StopWithTravel;
  dayId: Day["id"];
  settings: Settings;
  stopNumber: number;
  onDeleteStop: (dayId: Day["id"], stopId: Stop["id"]) => void;
  isFirstStopOfTrip: boolean;
}

const stopTypes = [
  {
    name: "Default",
    icon: <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white" />,
  },
  { name: "Overnight", icon: <Moon className="w-4 h-4 text-blue-800" /> },
  {
    name: "Outdoor Activity",
    icon: <TreePine className="w-4 h-4 text-green-600" />,
  },
  {
    name: "Place of Interest",
    icon: <CameraIcon className="w-4 h-4 text-teal-500" />,
  },
  { name: "Fuel", icon: <Fuel className="w-4 h-4 text-red-500" /> },
  {
    name: "Food and Drink",
    icon: <Utensils className="w-4 h-4 text-orange-500" />,
  },
];

const StopTypeIcon: FC<{ name: string; className?: string }> = ({ name, className }) => {
  const type = stopTypes.find((t) => t.name === name);
  if (!type) return null;
  return <div className={className}>{type.icon}</div>;
};

export const StopCard: FC<StopCardProps> = ({
  stop,
  dayId,
  settings,
  stopNumber,
  onDeleteStop,
  isFirstStopOfTrip,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Default");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `stop-${stop.id}`,
    data: {
      type: "stop",
      stop: stop,
      dayId: dayId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  // The first stop of the entire trip has no driving details before it.
  const showDrivingDetails = !isFirstStopOfTrip;
  const travelDetails = formatTravelDetails(stop.travel, settings);

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
      {showDrivingDetails && <TravelDetails details={travelDetails} />}
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
                    defaultValue="0"
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
                      <StopTypeIcon name={selectedType} />
                      <span>{selectedType}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {stopTypes.map((type) => (
                    <DropdownMenuItem key={type.name} onSelect={() => setSelectedType(type.name)}>
                      <div className="flex items-center gap-2">
                        <StopTypeIcon name={type.name} />
                        <span>{type.name}</span>
                      </div>
                      {selectedType === type.name && <Check className="w-4 h-4 ml-auto" />}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`notes-${stop.id}`} className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id={`notes-${stop.id}`}
                  className="w-full min-h-[80px]"
                  placeholder="Add notes about this stop"
                />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CameraIcon className="w-4 h-4 mr-2" />
                  Upload photo
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};
