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
import { addItineraryAction } from "@/lib/actions/itinerary";
import { CreateItineraryArg, CreateItinerarySchema } from "@/lib/schemas/itinerary";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";

export const ItineraryCreateForm = ({ stopId }: { stopId: string }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateItineraryArg>({
    resolver: zodResolver(CreateItinerarySchema),
    defaultValues: {
      name: "",
      notes: "",
      stopId,
    },
  });

  const onAddItinerary = (values: CreateItineraryArg) => {
    startTransition(async () => {
      const result = await addItineraryAction(values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Itinerary added successfully!");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onAddItinerary)} className="space-y-2">
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
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <CameraIcon className="w-4 h-4 mr-2" />
            Upload photo
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            Open in Google Maps
          </Button>
        </div>
      </form>
    </Form>
  );
};
