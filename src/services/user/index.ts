import { prisma } from "@/lib/prisma";

/**
 * Gets a user by email
 * @param email - The email of the user
 * @returns The user with the specified email
 */
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Gets a user by ID
 * @param userId - The ID of the user
 * @returns The user with the specified ID
 */
export const getUserById = (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
};
