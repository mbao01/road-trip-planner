"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Download, Settings, Sun, Moon, Laptop, Home, User, Palette, LogOut } from "lucide-react"
import { DateRangePicker } from "./date-range-picker"
import { parse } from "date-fns"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface TripHeaderProps {
  trip: {
    name: string
    dates: string
  }
  access: "Owner" | "Editor" | "Viewer" | "Public"
  onTripDataChange: (data: { name?: string }) => void
  onDateRangeChange: (dateRange: DateRange | undefined) => void
  onSettings: () => void
  onShare: () => void
}

const accessBadgeColors: Record<TripHeaderProps["access"], string> = {
  Owner: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Editor: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Viewer: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  Public: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
}

export function TripHeader({
  trip,
  access,
  onTripDataChange,
  onDateRangeChange,
  onSettings,
  onShare,
}: TripHeaderProps) {
  const [name, setName] = useState(trip.name)
  const { setTheme } = useTheme()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleNameBlur = () => {
    onTripDataChange({ name })
  }

  const [startStr, endStr] = trip.dates.split(" - ")
  const currentDateRange: DateRange = {
    from: parse(startStr, "dd/MM/yyyy", new Date()),
    to: parse(endStr, "dd/MM/yyyy", new Date()),
  }

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
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
          className="text-2xl font-bold mb-1 h-auto border-none focus-visible:ring-0 shadow-none p-0"
        />
        <div className="flex items-center gap-2">
          <DateRangePicker date={currentDateRange} onDateChange={onDateRangeChange} />
          <Badge variant="outline" className={cn("font-medium", accessBadgeColors[access])}>
            {access}
          </Badge>
        </div>
      </div>
    </div>
  )
}
