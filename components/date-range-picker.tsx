// "use client";

"use client";

import type * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";

interface SeparateDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  maxDays?: number;
  triggerClassName?: string;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  maxDays,
  triggerClassName,
}: SeparateDateRangePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleFromDateChange = (newFromDate: Date | undefined) => {
    onDateChange({ from: newFromDate, to: date?.to });
  };

  const handleToDateChange = (newToDate: Date | undefined) => {
    onDateChange({ from: date?.from, to: newToDate });
  };

  // For Start Date Picker
  const fromDateDisabledDays: React.ComponentProps<typeof Calendar>["disabled"] = [
    { before: today },
  ];
  if (date?.to) {
    fromDateDisabledDays.push({ after: date.to });
    if (maxDays) {
      const limit = addDays(date.to, -(maxDays - 1));
      fromDateDisabledDays.push({ before: limit });
    }
  }

  // For End Date Picker
  const toDateDisabledDays: React.ComponentProps<typeof Calendar>["disabled"] = [{ before: today }];
  if (date?.from) {
    toDateDisabledDays.push({ before: date.from });
    if (maxDays) {
      const limit = addDays(date.from, maxDays - 1);
      toDateDisabledDays.push({ after: limit });
    }
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4 relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-auto",
              triggerClassName,
              !date?.from && "text-muted-foreground"
            )}
          >
            {date?.from ? format(date.from, "dd/MM/yyyy") : <span>Start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date?.from}
            onSelect={handleFromDateChange}
            disabled={fromDateDisabledDays}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">-</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-auto",
              triggerClassName,
              !date?.to && "text-muted-foreground"
            )}
          >
            {date?.to ? format(date.to, "dd/MM/yyyy") : <span>End date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date?.to}
            onSelect={handleToDateChange}
            disabled={toDateDisabledDays}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// import type * as React from "react";
// import type { DateRange } from "react-day-picker";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";

// interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
//   date: DateRange | undefined;
//   onDateChange: (date: DateRange | undefined) => void;
//   disabled?: boolean;
//   disablePastDates?: boolean;
// }

// export function DateRangePicker({
//   className,
//   date,
//   onDateChange,
//   disabled = false,
//   disablePastDates = true,
// }: DateRangePickerProps) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"ghost"}
//             disabled={disabled}
//             className={cn(
//               "w-full justify-start text-left font-normal h-auto p-0 text-sm text-muted-foreground",
//               !date && "text-muted-foreground"
//             )}
//           >
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
//                 </>
//               ) : (
//                 format(date.from, "dd/MM/yyyy")
//               )
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={onDateChange}
//             numberOfMonths={2}
//             captionLayout="dropdown"
//             disabled={disablePastDates ? { before: today } : undefined}
//             fromDate={disablePastDates ? today : undefined}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
