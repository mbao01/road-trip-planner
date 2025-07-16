import { Badge } from "@/components/ui/badge";
import { TRIP_STATUS } from "@/helpers/constants/tripStatus";
import { cn } from "@/lib/utils";
import { TripStatus } from "@prisma/client";

const statusColors: Record<TripStatus, string> = {
  [TripStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TripStatus.NOT_STARTED]: "bg-gray-200 text-gray-800",
  [TripStatus.COMPLETED]: "bg-green-100 text-green-800",
  [TripStatus.ARCHIVED]: "bg-yellow-100 text-yellow-800",
  [TripStatus.DELETED]: "bg-red-100 text-red-800",
};

interface TripStatusBadgeProps {
  status: TripStatus;
}

export const TripStatusBadge = ({ status }: TripStatusBadgeProps) => {
  return (
    <Badge variant="outline" className={cn("font-medium text-nowrap", statusColors[status])}>
      {TRIP_STATUS[status]}
    </Badge>
  );
};
