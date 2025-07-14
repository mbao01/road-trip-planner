import { userRepo } from "@/repository/user";

const getUserByEmail = async ({ email }: { email: string }) => {
  const user = await userRepo.getUserByEmail(email);
  return { user };
};

const getUserById = async ({ userId }: { userId: string }) => {
  const user = await userRepo.getUserById(userId);
  return { user };
};

export const userService = {
  getUserByEmail,
  getUserById,
};
