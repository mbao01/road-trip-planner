import { User } from "@prisma/client";

const isUserDeleted = (user: User | null) => {
  return Boolean(user?.deletedAt);
};

export const userHelper = {
  isUserDeleted,
};
