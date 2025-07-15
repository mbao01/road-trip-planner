"use server";

import type { z } from "zod";
import { hashPassword, verifyPassword } from "@/helpers/passwordHash";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePasswordSchema } from "@/lib/schemas/user";
import { userRepo } from "@/repository/user";
import { del, put } from "@vercel/blob";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File | null;

  if (!name) {
    return { error: "Name is required." };
  }

  let newImageUrl: string | undefined = undefined;

  try {
    const user = await userRepo.getUserById(session.user.id);
    if (!user) {
      return { error: "User not found." };
    }

    // Handle file upload if a new image is provided
    if (imageFile && imageFile.size > 0) {
      // Delete old blob if it exists and is a vercel blob url
      if (user.image && user.image.includes("blob.vercel-storage.com")) {
        try {
          await del(user.image);
        } catch (error) {
          console.error("Failed to delete old blob:", error);
          // Don't block update if deletion fails
        }
      }

      // Upload new blob
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      });
      newImageUrl = blob.url;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        // Only update image if a new one was uploaded
        ...(newImageUrl && { image: newImageUrl }),
      },
    });

    return { success: "Profile updated.", image: updatedUser.image };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Something went wrong." };
  }
}

export async function updatePasswordAction(values: z.infer<typeof updatePasswordSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const user = await userRepo.getUserById(session.user.id);
  if (!user || !user.password) {
    return { error: "User not found or no password set." };
  }

  const validatedFields = updatePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const passwordsMatch = verifyPassword(currentPassword, user.password);
  if (!passwordsMatch) {
    return { error: "Incorrect current password." };
  }

  const hashedNewPassword = hashPassword(newPassword);

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
      },
    });
    return { success: "Password updated." };
  } catch (error) {
    return { error: (error as { message: string })?.message ?? "Something went wrong." };
  }
}

export async function deleteAccountAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await userRepo.getUserById(session.user.id);
    if (user?.image && user.image.includes("blob.vercel-storage.com")) {
      await del(user.image);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { deletedAt: new Date() },
    });

    // Sign out after successful deletion
    await signOut({ redirectTo: "/" });

    return { success: "Account deleted." };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Something went wrong." };
  }
}
