"use client";

import type { TripTableRow } from "@/types/trip";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { TRIP_ACCESS } from "@/helpers/constants/tripAccess";
import { TRIP_STATUS } from "@/helpers/constants/tripStatus";
import { formatDate } from "@/utilities/dates";
import { TripStatus } from "@prisma/client";
import { Archive, Edit, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { DeleteTripConfirmationDialog } from "./delete-trip-confirmation-dialog";
import { ShareModal } from "./share-modal";

interface TripsTableProps {
  initialTrips: TripTableRow[];
}

const statusColors: Record<TripStatus, string> = {
  [TripStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TripStatus.NOT_STARTED]: "bg-gray-100 text-gray-800",
  [TripStatus.COMPLETED]: "bg-green-100 text-green-800",
  [TripStatus.ARCHIVED]: "bg-yellow-100 text-yellow-800",
  [TripStatus.ACTIVE]: "bg-blue-100 text-blue-800",
  [TripStatus.DELETED]: "bg-gray-100 text-gray-800",
};

export function TripsTable({ initialTrips }: TripsTableProps) {
  const [trips, setTrips] = useState(initialTrips);
  const [tripToDelete, setTripToDelete] = useState<TripTableRow | null>(null);
  const [tripToShare, setTripToShare] = useState<TripTableRow | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleArchive = async (tripId: string) => {
    // This is an optimistic update. We can add API logic later.
    setTrips(trips.map((t) => (t.id === tripId ? { ...t, status: TripStatus.ARCHIVED } : t)));
    toast({ title: "Trip archived" });
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    // Optimistic update
    setTrips(trips.filter((t) => t.id !== tripToDelete.id));
    setTripToDelete(null);
    toast({ title: "Trip deleted" });
    // Add API call here in a real app: await api.deleteTrip(tripToDelete.id)
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip Name</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-center">Days</TableHead>
              <TableHead className="text-center">Stops</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.name}</TableCell>
                <TableCell>
                  {formatDate(trip.startDate, "dd/MM/yyyy")} -{" "}
                  {formatDate(trip.endDate, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-center">{trip.dayCount}</TableCell>
                <TableCell className="text-center">{trip.stopCount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[trip.status]}>
                    {TRIP_STATUS[trip.status]}
                  </Badge>
                </TableCell>
                <TableCell>{TRIP_ACCESS[trip.access]}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/trips/${trip.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit trip</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTripToShare(trip)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share trip</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(trip.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archive trip</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTripToDelete(trip)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete trip</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {tripToDelete && (
        <DeleteTripConfirmationDialog
          open={!!tripToDelete}
          onOpenChange={() => setTripToDelete(null)}
          onConfirm={handleDelete}
          tripName={tripToDelete.name}
        />
      )}
      {tripToShare && (
        <ShareModal
          open={!!tripToShare}
          onOpenChange={() => setTripToShare(null)}
          tripName={tripToShare.name}
        />
      )}
    </>
  );
}
