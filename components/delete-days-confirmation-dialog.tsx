"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Stop = {
  id: number
  name: string
}

type Day = {
  id: number
  date: string
  stops: Stop[]
}

interface DeleteDaysConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  daysToDelete: Day[]
}

export function DeleteDaysConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  daysToDelete,
}: DeleteDaysConfirmationDialogProps) {
  if (!daysToDelete || daysToDelete.length === 0) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Reducing the date range will permanently delete the following days and all the stops within them. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-60 overflow-y-auto pr-2 -mr-2">
          <div className="space-y-4">
            {daysToDelete.map((day, index) => (
              <Card key={day.id} className="bg-muted/50">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-semibold">
                    Day {index + 1} ({day.date})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {day.stops.map((stop) => (
                      <li key={stop.id}>{stop.name}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Delete Days
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
