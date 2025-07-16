import type { PageProps } from "@/types/page";
import { notFound } from "next/navigation";
import { settingsHelpers } from "@/helpers/settings";
import { tripService } from "@/services/trip";
import { TripAccess } from "@prisma/client";
import { ShareTripPlanner } from "./components/share-trip-planner";

export default async function ShareTripPage({ params }: PageProps<{ tripId: string }>) {
  const { tripId } = await params;
  const { trip } = await tripService.getPublicTrip({ tripId });

  if (!trip || trip.access !== TripAccess.PUBLIC) {
    notFound();
  }

  const settings = settingsHelpers.getNormalizedSettings(trip.settings);

  return (
    <div className="h-screen flex flex-col">
      {/* <header className="flex items-center justify-between p-4 border-b bg-background">
        <AppLogo />
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </header> */}
      <div className="flex-1 min-h-0">
        <ShareTripPlanner trip={trip} settings={settings} />
      </div>
    </div>
  );
}
