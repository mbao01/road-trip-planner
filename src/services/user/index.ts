import { userHelper } from "@/helpers/user";
import { userRepo } from "@/repository/user";

/**
 * Gets a user by email
 * @param email - The email of the user
 * @returns The user with the specified email
 */
const getUserByEmail = async ({ email }: { email: string }) => {
  const user = await userRepo.getUserByEmail(email);
  return { user };
};

/**
 * Gets a user by ID
 * @param userId - The ID of the user
 * @returns The user with the specified ID
 */
const getUserById = async ({ userId }: { userId: string }) => {
  const user = await userRepo.getUserById(userId);
  return { user };
};

const isUserDeleted = async ({ userId }: { userId: string }) => {
  const user = await userRepo.getUserById(userId);
  return userHelper.isUserDeleted(user);
};

export const userService = {
  getUserByEmail,
  getUserById,
  isUserDeleted,
};
