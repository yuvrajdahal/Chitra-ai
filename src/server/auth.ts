import { prisma } from "@/server/db";
import { GetServerSidePropsContext } from "next";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Session } from "inspector";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
export const authOptions: NextAuthOptions = {
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
        console.log(email, password);
        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (user && user.password === password) {
            return user;
          } else {
            throw new Error("Invalid");
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
