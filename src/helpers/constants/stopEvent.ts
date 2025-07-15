import { StopEvent } from "@prisma/client";

export const STOP_EVENT = {
  [StopEvent.DEFAULT]: "Default",
  [StopEvent.FOOD_AND_DRINK]: "Food and Drink",
  [StopEvent.FUEL]: "Fuel",
  [StopEvent.OUTDOOR_ACTIVITY]: "Outdoor Activity",
  [StopEvent.OVERNIGHT]: "Overnight",
  [StopEvent.PLACE_OF_INTEREST]: "Place of Interest",
};
