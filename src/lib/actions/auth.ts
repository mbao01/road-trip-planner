"use server"

import { AuthError } from "next-auth"
import bcrypt from "bcrypt"
import type { z } from "zod"

import { signIn } from "@/lib/auth"
import type { SignInSchema, SignUpSchema } from "@/lib/schemas/auth"
import { prisma } from "@/lib/prisma"
import { getUserByEmail } from "@/services/user"

export async function signInAction(values: z.infer<typeof SignInSchema>) {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirectTo: "/trips",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "An unexpected error occurred." }
      }
    }
    throw error
  }
}

export async function signUpAction(values: z.infer<typeof SignUpSchema>) {
  const existingUser = await getUserByEmail(values.email)

  if (existingUser) {
    return { error: "An account with this email already exists." }
  }

  const hashedPassword = await bcrypt.hash(values.password, 10)

  await prisma.user.create({
    data: {
      name: values.name,
      email: values.email,
      password: hashedPassword,
    },
  })

  return { success: "Account created successfully!" }
}
