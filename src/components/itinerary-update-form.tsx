"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { updateItineraryAction } from "@/lib/actions/itinerary";
import { UpdateItineraryArg, UpdateItinerarySchema } from "@/lib/schemas/itinerary";
import { zodResolver } from "@hookform/resolvers/zod";
import { Itinerary } from "@prisma/client";
import { CameraIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

export const ItineraryUpdateForm = ({
  stopId,
  itinerary,
}: {
  stopId: string;
  itinerary: Itinerary;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateItineraryArg>({
    resolver: zodResolver(UpdateItinerarySchema),
    defaultValues: {
      name: itinerary.name ?? "",
      notes: itinerary.notes ?? "",
      itineraryId: itinerary.id,
      stopId: itinerary.stopId,
    },
  });

  const onUpdateItinerary = (values: UpdateItineraryArg) => {
    startTransition(async () => {
      const result = await updateItineraryAction(values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Itinerary updated successfully!");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onUpdateItinerary)} className="space-y-2">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={`notes-${stopId}`}
                  className="w-full min-h-[80px]"
                  placeholder="Add notes about this stop"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2 flex justify-between gap-2">
          <Button type="button" variant="outline" className="w-full justify-start bg-transparent">
            <CameraIcon className="w-4 h-4 mr-2" />
            Upload photo
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            {isPending ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SaveIcon className="mr-2 h-4 w-4" />
            )}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
