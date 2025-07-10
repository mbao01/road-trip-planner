"use client"

import type * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  disablePastDates?: boolean;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  disabled = false,
  disablePastDates = true,
}: DateRangePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"ghost"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-auto p-0 text-sm text-muted-foreground",
              !date && "text-muted-foreground",
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={disablePastDates ? { before: today } : undefined}
            fromDate={disablePastDates ? today : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
