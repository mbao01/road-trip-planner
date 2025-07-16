"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Code, Copy, Mail } from "lucide-react";
import { siFacebook, siMessenger, siWhatsapp, siX } from "simple-icons";

interface SocialShareProps {
  shareUrl: string;
  tripName: string;
  isPublic: boolean;
}

export function SocialShare({ shareUrl, tripName, isPublic }: SocialShareProps) {
  const { toast } = useToast();
  const [showEmbed, setShowEmbed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied to clipboard" });
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(`Check out my trip: ${tripName}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareByEmail = () => {
    const subject = `Check out my trip: ${tripName}`;
    const body = `I thought you might be interested in this trip I planned: ${shareUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const shareOnWhatsApp = () => {
    const text = `Check out my trip: ${tripName}\n${shareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnMessenger = () => {
    handleCopy();
    toast({ title: "Link copied!", description: "You can now paste it into Messenger." });
  };

  const handleEmbed = () => {
    setShowEmbed(!showEmbed);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${shareUrl}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({ title: "Embed code copied to clipboard" });
  };

  return (
    <div className="pt-4 border-t">
      <div className="flex justify-center gap-3 mb-4">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={!isPublic}
          onClick={shareOnFacebook}
        >
          <Icon src={siFacebook} className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={!isPublic}
          onClick={shareOnMessenger}
        >
          <Icon src={siMessenger} className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={!isPublic}
          onClick={shareByEmail}
        >
          <Mail className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={!isPublic}
          onClick={shareOnWhatsApp}
        >
          <Icon src={siWhatsapp} className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={!isPublic}
          onClick={shareOnTwitter}
        >
          <Icon src={siX} className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        className="w-full justify-start bg-transparent"
        disabled={!isPublic}
        onClick={handleEmbed}
      >
        <Code className="w-4 h-4 mr-2" />
        Add to website
      </Button>
      {showEmbed && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center flex-1 border rounded-md pl-3 h-10">
            <Input
              disabled
              readOnly
              id="embed-code"
              value={`<iframe src="${shareUrl}" ...></iframe>`}
              className="flex-1 text-sm border-none focus-visible:ring-0 shadow-none h-auto p-2 bg-transparent"
            />
          </div>
          <Button onClick={handleCopyEmbed} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            <Copy className="w-4 h-4" />
            Copy code
          </Button>
        </div>
      )}
    </div>
  );
}
