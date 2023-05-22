import { env } from "@/env.mjs";
import { User } from "@prisma/client";
import { prisma } from "@/server/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const options: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && user.password === password) {
          return user as User;
        } else {
          return null;
        }
      },
    }),
  ],
  jwt: {
    secret: env.JWT_SECRET,
    maxAge: 7 * 24 * 60 * 60,
  },
};
export default NextAuth(options);
