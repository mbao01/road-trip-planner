"use client";

import type React from "react";
import type { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Role, Trip } from "@prisma/client";
import { isSameDay, parse } from "date-fns";
import {
  CheckIcon,
  Download,
  Home,
  Laptop,
  LogOut,
  Moon,
  Palette,
  Settings,
  Sun,
  User,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { DateRangePicker } from "./date-range-picker";

interface TripHeaderProps {
  trip: Trip;
  access: Role;
  onTripNameChange: (data: { name?: string }) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onSettings: () => void;
  onShare: () => void;
}

const accessBadgeColors: Record<TripHeaderProps["access"], string> = {
  [Role.OWNER]: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  [Role.EDITOR]: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  [Role.VIEWER]: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  [Role.PUBLIC]: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
};

export function TripHeader({
  trip,
  access,
  onTripNameChange,
  onDateRangeChange,
  onSettings,
  onShare,
}: TripHeaderProps) {
  const [name, setName] = useState(trip.name);
  const { setTheme } = useTheme();
  const currentDateRange = {
    from: trip.startDate,
    to: trip.endDate,
  };
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
    currentDateRange
  );

  // Sync local state if props change from parent (e.g., after a successful save)
  useEffect(() => {
    setSelectedDateRange({ from: trip.startDate, to: trip.endDate });
  }, [trip.startDate, trip.endDate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    if (name !== trip.name) {
      onTripNameChange({ name });
    }
  };

  const handleSaveDates = () => {
    onDateRangeChange(selectedDateRange);
  };

  const handleCancelDates = () => {
    setSelectedDateRange(currentDateRange);
  };

  const isDateRangeChanged =
    !isSameDay(currentDateRange.from, selectedDateRange?.from || currentDateRange.from) ||
    !isSameDay(currentDateRange.to, selectedDateRange?.to || currentDateRange.to);

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link href="/trips">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button size="sm" onClick={onShare} className="bg-orange-500 hover:bg-orange-600">
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-orange-100 text-orange-600">A</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/trips">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Trips</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
        <Input
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          className="!text-2xl font-bold mb-2 h-auto border-none focus-visible:ring-0 shadow-none p-1"
        />
        <div className="flex items-center gap-2">
          <DateRangePicker
            maxDays={10}
            date={selectedDateRange}
            onDateChange={setSelectedDateRange}
            triggerClassName="px-1 py-0"
          />
          {isDateRangeChanged && (
            <>
              <Button
                onClick={handleSaveDates}
                size="icon"
                variant="outline"
                aria-label="Save date changes"
                className="h-auto p-0.5 w-auto"
              >
                <CheckIcon className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              <Button
                onClick={handleCancelDates}
                size="icon"
                variant="outline"
                aria-label="Cancel date changes"
                className="h-auto p-0.5 w-auto"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </>
          )}

          <Badge variant="outline" className={cn("font-medium ml-auto", accessBadgeColors[access])}>
            {access}
          </Badge>
        </div>
      </div>
    </div>
  );
}
