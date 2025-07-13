import { Badge } from "@/components/ui/badge";
import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { cn } from "@/lib/utils";
import { TripRole } from "@prisma/client";

const roleBadgeColors: Record<TripRole, string> = {
  [TripRole.OWNER]: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  [TripRole.EDITOR]: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  [TripRole.VIEWER]: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  [TripRole.PUBLIC]: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
};

interface TripRoleBadgeProps {
  tripRole: TripRole;
}

export const TripRoleBadge = ({ tripRole }: TripRoleBadgeProps) => {
  return (
    <Badge variant="outline" className={cn("font-medium ml-auto", roleBadgeColors[tripRole])}>
      {TRIP_ROLE[tripRole]}
    </Badge>
  );
};
