import { Resource, resourceGuard } from "@/app/api/utilities/guards";
import { validator } from "@/app/api/utilities/validation";
import {
  UpdateTripSettingsArg,
  updateTripSettingsSchema,
} from "@/app/api/utilities/validation/schemas/trip";
import { settingsRepo } from "@/repository/settings";
import { TripRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const updateSettings = async ({ tripId }: { tripId: string }, data: UpdateTripSettingsArg) => {
  await resourceGuard({
    [Resource.TRIP]: { tripId, roles: [TripRole.EDITOR] },
  });

  const result = validator(data, updateTripSettingsSchema);

  if (!result.success) {
    throw new Error(result.message, {
      cause: { status: StatusCodes.BAD_REQUEST, errors: result.errors },
    });
  }

  const settings = await settingsRepo.updateTripSettings(tripId, result.data);

  return { settings };
};

export const settingsService = {
  updateSettings,
};
