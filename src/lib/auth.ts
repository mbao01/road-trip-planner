import { verifyPassword } from "@/helpers/passwordHash";
import { userHelper } from "@/helpers/user";
import { prisma } from "@/lib/prisma";
import { SignInSchema } from "@/lib/schemas/auth";
import { userService } from "@/services/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { user } = await userService.getUserByEmail({ email });
          if (!user || !user.password) return null;

          const passwordsMatch = verifyPassword(password, user.password);

          if (passwordsMatch) return user;
          return null;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // ⏳ 24 hrs (in seconds)
    updateAge: 1 * 60 * 60, // 🔁 Refresh JWT if session is older than 1 hr
  },
  jwt: {
    maxAge: 24 * 60 * 60, // ensures the token itself also expires in the same timeframe.
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.id) return false;

      const isDeleted = await userService.isUserDeleted({ userId: user.id });

      return !isDeleted;
    },
    async session({ token, session }) {
      if (!token?.sub) return null as unknown as Session;

      const isDeleted = await userService.isUserDeleted({ userId: token.sub });

      if (isDeleted) {
        return null as unknown as Session;
      }

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
