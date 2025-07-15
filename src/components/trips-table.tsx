"use client";

import type { UserTrips } from "@/types/trip";
import { useState } from "react";
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";
import { deleteTrip } from "@/lib/api";
import { formatDate } from "@/utilities/dates";
import { TripRole, TripStatus } from "@prisma/client";
import {
  ArchiveIcon,
  EarthIcon,
  MapIcon,
  MoreHorizontalIcon,
  RouteIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { DeleteTripConfirmationDialog } from "./delete-trip-confirmation-dialog";
import { ShareModal } from "./share-modal";
import { TripRoleBadge } from "./trip-role-badge";
import { TripStatusBadge } from "./trip-status-badge";

interface TripsTableProps {
  initialTrips: UserTrips;
}

export function TripsTable({ initialTrips }: TripsTableProps) {
  const session = useSession();
  const [trips, setTrips] = useState(initialTrips);
  const [tripToDelete, setTripToDelete] = useState<UserTrips[number] | null>(null);
  const [tripToShare, setTripToShare] = useState<UserTrips[number] | null>(null);
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
    await deleteTrip(tripToDelete.id);
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
            {trips.map((trip) => {
              const { ownerId, collaborators } = trip;
              const collaborator = ownerId
                ? collaborators.find((c) => c.userId === ownerId)!
                : collaborators[0];
              const { tripRole } = collaborator;

              return (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.name}</TableCell>
                  <TableCell>
                    {formatDate(trip.startDate, "dd/MM/yyyy")} -{" "}
                    {formatDate(trip.endDate, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-center">{trip.dayCount}</TableCell>
                  <TableCell className="text-center">{trip.stopCount}</TableCell>
                  <TableCell>
                    <TripStatusBadge status={trip.status} />
                  </TableCell>
                  <TableCell>
                    <TripRoleBadge tripRole={tripRole} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          {tripRole === TripRole.OWNER || tripRole === TripRole.EDITOR ? (
                            <Link href={`/trips/${trip.id}`}>
                              <RouteIcon className="mr-2 h-4 w-4" />
                              <span>Edit trip</span>
                            </Link>
                          ) : tripRole === TripRole.VIEWER ? (
                            <Link href={`/trips/${trip.id}`}>
                              <MapIcon className="mr-2 h-4 w-4" />
                              <span>View trip</span>
                            </Link>
                          ) : (
                            <Link href={`/trips/share/${trip.id}`}>
                              <EarthIcon className="mr-2 h-4 w-4" />
                              <span>View trip</span>
                            </Link>
                          )}
                        </DropdownMenuItem>
                        {tripRole === TripRole.OWNER && (
                          <DropdownMenuItem onClick={() => setTripToShare(trip)}>
                            <Share2Icon className="mr-2 h-4 w-4" />
                            <span>Share trip</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleArchive(trip.id)}>
                          <ArchiveIcon className="mr-2 h-4 w-4" />
                          <span>Archive trip</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTripToDelete(trip)}
                          className="text-destructive"
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          <span>Delete trip</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
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
          trip={tripToShare}
          userId={session.data?.user?.id}
          open={!!tripToShare}
          onOpenChange={() => setTripToShare(null)}
          onTripChange={(trip) => {
            setTripToShare({ ...tripToShare, ...trip });
            setTrips((prevTrips) => {
              return prevTrips.map((t) => (trip.id === t.id ? { ...t, ...trip } : t));
            });
          }}
        />
      )}
    </>
  );
}
