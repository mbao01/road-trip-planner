import { Loader2Icon } from "lucide-react";

export default function TripsLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2Icon className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );
}
