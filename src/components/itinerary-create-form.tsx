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
import { Loader2Icon, SaveIcon } from "lucide-react";
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
        <div className="space-y-2 flex justify-end">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            {isPending ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SaveIcon className="mr-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
