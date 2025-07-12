"use client"

import { useState, useTransition } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, Loader2, LogOut, Settings, Share2, User, Users } from "lucide-react"

import type { TripDetails } from "@/types/trip"
import { updateTripDetails } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAbbreviation } from "@/utilities/helpers/getAbbreviation"
import { ThemeToggle } from "./theme-toggle"
import { ShareModal } from "./share-modal"
import SettingsModal from "./settings-modal"

interface TripHeaderProps {
  trip: TripDetails
}

export function TripHeader({ trip }: TripHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)
  const [isShareModalOpen, setShareModalOpen] = useState(false)
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false)

  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: new Date(trip.startDate),
    to: new Date(trip.endDate),
  })

  const hasDateChanged = date.from.toISOString() !== trip.startDate || date.to.toISOString() !== trip.endDate

  const handleSaveDates = async () => {
    setIsSaving(true)
    try {
      await updateTripDetails(trip.id, {
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
      })
      toast.success("Trip dates updated successfully!")
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      toast.error("Failed to update trip dates.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{trip.name}</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker date={date} onDateChange={setDate} maxDays={30} disabled={isPending} />
          {hasDateChanged && (
            <Button size="sm" onClick={handleSaveDates} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span className="sr-only">Save Dates</span>
            </Button>
          )}
        </div>
        <Badge variant="outline">{trip.access}</Badge>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSettingsModalOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} />
                <AvatarFallback>{getAbbreviation(session?.user?.name ?? "")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/trips">
                <Users className="mr-2 h-4 w-4" />
                <span>Trips</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <span className="mr-2">Theme</span>
              <ThemeToggle />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} />
      {trip.settings && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          settings={trip.settings}
          tripId={trip.id}
        />
      )}
    </header>
  )
}
