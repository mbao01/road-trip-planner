import { User } from "@prisma/client";

const isUserDeleted = (user: User) => {
  return Boolean(user?.deletedAt);
};

export const userHelper = {
  isUserDeleted,
};