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
import { TripRole } from "@prisma/client";
import {
  Code,
  Copy,
  Facebook,
  LinkIcon,
  Mail,
  MessageCircle,
  MessageSquare,
  Trash2,
  Twitter,
} from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripName: string;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  image: string;
  tripRole: TripRole;
}

const initialCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    image: "/placeholder.svg?height=32&width=32",
    tripRole: TripRole.EDITOR,
  },
  {
    id: "2",
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    image: "/placeholder.svg?height=32&width=32",
    tripRole: TripRole.VIEWER,
  },
  {
    id: "3",
    name: "You",
    email: "your.email@example.com",
    image: "/placeholder.svg?height=32&width=32",
    tripRole: TripRole.EDITOR,
  },
];

export function ShareModal({ open, onOpenChange, tripName }: ShareModalProps) {
  const [shareEnabled, setShareEnabled] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TripRole>(TripRole.VIEWER);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);

  const shareUrl = `https://www.wildertrips.com/share/${tripName.toLowerCase().replace(/\s/g, "-")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    // Maybe add a toast notification here
  };

  const handleInvite = () => {
    if (inviteEmail && !collaborators.some((c) => c.email === inviteEmail)) {
      const newCollaborator: Collaborator = {
        id: String(Date.now()),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        image: `/placeholder.svg?height=32&width=32&query=avatar`,
        tripRole: inviteRole,
      };
      setCollaborators([...collaborators, newCollaborator]);
      setInviteEmail("");
    }
  };

  const handleRoleChange = (id: string, newTripRole: TripRole) => {
    setCollaborators(collaborators.map((c) => (c.id === id ? { ...c, tripRole: newTripRole } : c)));
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share &quot;{tripName}&quot;</DialogTitle>
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
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
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
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Shared with</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={collaborator.image || "/placeholder.svg"}
                        alt={collaborator.name}
                      />
                      <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{collaborator.name}</p>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                  </div>
                  {collaborator.name !== "You" ? (
                    <div className="flex items-center gap-2">
                      <Select
                        value={collaborator.tripRole}
                        onValueChange={(value) =>
                          handleRoleChange(collaborator.id, value as TripRole)
                        }
                      >
                        <SelectTrigger className="w-[100px] text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Owner</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Public access */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="share-trip" className="text-sm font-medium">
                Public access
              </Label>
              <Switch id="share-trip" checked={shareEnabled} onCheckedChange={setShareEnabled} />
            </div>
            {shareEnabled && (
              <div className="flex items-center gap-2">
                <div className="flex items-center flex-1 border rounded-md pl-3">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-sm border-none focus-visible:ring-0 shadow-none h-auto p-2"
                  />
                </div>
                <Button
                  size="sm"
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
          <div className="pt-4 border-t">
            <div className="flex justify-center gap-3 mb-4">
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Facebook className="w-4 h-4 text-blue-600" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <MessageCircle className="w-4 h-4 text-blue-500" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Mail className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <MessageSquare className="w-4 h-4 text-green-500" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                <Twitter className="w-4 h-4 text-blue-400" />
              </Button>
            </div>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Code className="w-4 h-4 mr-2" />
              Add to website
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
