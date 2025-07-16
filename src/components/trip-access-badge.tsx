import { Badge } from "@/components/ui/badge";
import { TRIP_ACCESS } from "@/helpers/constants/tripAccess";
import { cn } from "@/lib/utils";
import { TripAccess } from "@prisma/client";

const accessBadgeColors: Record<TripAccess, string> = {
  [TripAccess.PUBLIC]: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  [TripAccess.PRIVATE]: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
};

interface TripAccessBadgeProps {
  tripAccess: TripAccess;
}

export const TripAccessBadge = ({ tripAccess }: TripAccessBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-nowrap", accessBadgeColors[tripAccess])}
    >
      {TRIP_ACCESS[tripAccess]}
    </Badge>
  );
};
