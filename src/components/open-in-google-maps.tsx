import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";

export const OpenInGoogleMaps = ({ placeId }: { placeId: string }) => {
  return (
    <Button type="button" variant="link" className="w-full bg-transparent justify-center" asChild>
      <a
        href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
        rel="noopener"
        target="_blank"
      >
        <ExternalLinkIcon className="w-4 h-4" />
        Open in Google Maps
      </a>
    </Button>
  );
};
