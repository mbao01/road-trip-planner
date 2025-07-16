"use client";

import type { z } from "zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteAccountAction, updateProfileAction } from "@/lib/actions/user";
import { updateProfileSchema } from "@/lib/schemas/user";
import { getAbbreviation } from "@/utilities/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SaveIcon, Trash2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DeleteAccountConfirmationDialog } from "./delete-account-confirmation-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type ProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (session) {
      profileForm.reset({
        name: session.user?.name ?? "",
        image: undefined,
      });
    }
  }, [session, profileForm]);

  const handleProfileUpdate = (values: z.infer<typeof updateProfileSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        await update(true);
        toast.success("Profile updated successfully!");
        setPreviewImage(null);
        profileForm.reset({ name: values.name, image: undefined });
      }
    });
  };

  const handleDeleteAccount = () => {
    startTransition(async () => {
      const result = await deleteAccountAction();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account deleted successfully.");
        onOpenChange(false);
      }
    });
  };

  const currentImage = previewImage ?? session?.user?.image ?? "";

  return (
    <>
      <DeleteAccountConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDeleteAccount}
        isPending={isPending}
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>Manage your account details.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="danger" className="text-destructive">
                Danger
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-4">
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {getAbbreviation(profileForm.watch("name") ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <FormField
                      control={profileForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <span>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4" />
                                Upload Picture
                              </Button>
                              <Input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    field.onChange(files);
                                    setPreviewImage(URL.createObjectURL(files[0]));
                                  }
                                }}
                              />
                            </span>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input value={session?.user?.email ?? ""} disabled />
                  </FormItem>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPending || !profileForm.formState.isDirty}>
                      {isPending ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                      ) : (
                        <SaveIcon className="h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="danger" className="mt-4">
              <div className="space-y-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <h4 className="font-semibold text-destructive">Delete Account</h4>
                <p className="text-sm text-destructive/80">
                  Permanently delete your account and all associated data, including your trips and
                  collaborations. This action is irreversible.
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete My Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
