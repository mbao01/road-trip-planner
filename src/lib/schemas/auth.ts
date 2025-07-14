import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  callbackUrl: z.string().optional(),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  callbackUrl: z.string().optional(),
});
