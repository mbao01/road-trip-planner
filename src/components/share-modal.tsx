"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TRIP_ROLE } from "@/helpers/constants/tripAccess";
import { toast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import { CollaboratorWithUser, UserTrips } from "@/types/trip";
import { createTempId } from "@/utilities/identity";
import { TripAccess, TripRole } from "@prisma/client";
import { Copy, LinkIcon, Trash2 } from "lucide-react";
import { SocialShare } from "./social-share";
import { TripRoleBadge } from "./trip-role-badge";

interface ShareModalProps {
  open: boolean;
  trip: UserTrips[number];
  userId: string | undefined;
  onTripChange: (trip: UserTrips[number]) => void;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ open, trip, userId, onTripChange, onOpenChange }: ShareModalProps) {
  const isTripPublic = trip.access === TripAccess.PUBLIC;
  const [shareEnabled, setShareEnabled] = useState(isTripPublic);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TripRole>(TripRole.VIEWER);

  const shareUrl = `${window.location.origin}/share/${trip.id.toLowerCase().replace(/\s/g, "-")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    // Maybe add a toast notification here
    toast({ title: "Link copied to clipboard" });
  };

  const handleAction = async (
    action: () => Promise<unknown>,
    optimisticState: UserTrips[number],
    successMessage: string,
    failureMessage: string
  ) => {
    const originalState = trip;
    onTripChange(optimisticState);
    try {
      await action();
      const result = await api.fetchTrip(trip.id);

      onTripChange({ ...optimisticState, ...result });
      toast({ title: successMessage });
    } catch (error) {
      onTripChange(originalState);
      console.error(error);
      toast({ variant: "destructive", title: failureMessage });
    }
  };

  const handleInvite = () => {
    const hasNoCollaborator =
      inviteEmail && !trip.collaborators.some((c) => c.user.email === inviteEmail);

    if (hasNoCollaborator) {
      const userId = createTempId("user");
      const newCollaborator: CollaboratorWithUser = {
        userId,
        tripId: trip.id,
        id: createTempId("collaborator"),
        user: {
          id: createTempId("user"),
          name: "-",
          email: inviteEmail,
          image: `/placeholder.svg?height=32&width=32&query=avatar`,
        },
        tripRole: inviteRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const clone = structuredClone(trip);
      clone.collaborators = [newCollaborator, ...clone.collaborators];

      handleAction(
        async () => {
          await api.addCollaborator(clone.id, newCollaborator);
          setInviteEmail("");
        },
        clone,
        "User invited successfully",
        "Failed to invite user"
      );
    }
  };

  const handleRoleChange = (collaboratorId: string, newTripRole: TripRole) => {
    const clone = structuredClone(trip);
    clone.collaborators = clone.collaborators.map((c) =>
      c.id === collaboratorId ? { ...c, tripRole: newTripRole } : c
    );

    handleAction(
      () => api.updateCollaborator(clone.id, collaboratorId, { tripRole: newTripRole }),
      clone,
      "User role updated successfully",
      "Failed to update user role"
    );
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    const clone = structuredClone(trip);
    clone.collaborators = clone.collaborators.filter((c) => c.id !== collaboratorId);

    handleAction(
      () => api.removeCollaborator(clone.id, collaboratorId),
      clone,
      "User removed successfully",
      "Failed to remove user"
    );
  };

  const handleTripAccessChange = (checked: boolean) => {
    handleAction(
      () =>
        api.updateTripDetails(trip.id, {
          access: checked ? TripAccess.PUBLIC : TripAccess.PRIVATE,
        }),
      trip,
      "Trip access updated",
      "Failed to update trip access"
    );
    setShareEnabled(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share &quot;{trip.name}&quot;</DialogTitle>
          <DialogDescription>Invite collaborators or share a public link.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invite by email */}
          <div>
            <Label htmlFor="invite-email" className="text-sm font-medium">
              Invite by email
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="invite-email"
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value as TripRole)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TripRole.EDITOR}>{TRIP_ROLE[TripRole.EDITOR]}</SelectItem>
                  <SelectItem value={TripRole.VIEWER}>{TRIP_ROLE[TripRole.VIEWER]}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Invite
              </Button>
            </div>
          </div>

          {/* Collaborators list */}
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Shared with</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto py-1 pr-2">
              {trip.collaborators.map((collaborator) => {
                const collaboratorId = collaborator.id;
                const name = collaborator.user.name ?? "-";
                const email = collaborator.user.email;
                const image = collaborator.user.image || "/placeholder.svg";
                const tripRole = collaborator.tripRole;
                const isOwner = trip.ownerId && collaborator.user.id === trip.ownerId;
                const isCurrentUser = collaborator.user.id === userId;

                return (
                  <div key={collaboratorId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{isCurrentUser ? "You" : name}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                      </div>
                    </div>
                    {!isCurrentUser && !isOwner ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={tripRole}
                          onValueChange={(value) =>
                            handleRoleChange(collaboratorId, value as TripRole)
                          }
                        >
                          <SelectTrigger className="w-[100px] text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TripRole.EDITOR}>
                              {TRIP_ROLE[TripRole.EDITOR]}
                            </SelectItem>
                            <SelectItem value={TripRole.VIEWER}>
                              {TRIP_ROLE[TripRole.VIEWER]}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveCollaborator(collaboratorId)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        <TripRoleBadge tripRole={tripRole} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Public access */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="share-trip" className="text-sm font-medium">
                Public access
              </Label>
              <Switch
                id="share-trip"
                checked={shareEnabled}
                onCheckedChange={handleTripAccessChange}
              />
            </div>
            {shareEnabled && (
              <div className="flex items-center gap-2">
                <div className="flex items-center flex-1 border rounded-md pl-3 h-10">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <Input
                    disabled
                    readOnly
                    id="share-url"
                    value={isTripPublic ? shareUrl : "Loading..."}
                    className="flex-1 text-sm border-none focus-visible:ring-0 shadow-none h-auto p-2 bg-transparent"
                  />
                </div>
                <Button
                  disabled={!isTripPublic}
                  onClick={handleCopy}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
              </div>
            )}
          </div>

          {/* Social sharing and embed */}
          {shareEnabled && (
            <SocialShare shareUrl={shareUrl} tripName={trip.name} isPublic={isTripPublic} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
