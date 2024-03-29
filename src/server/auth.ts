import { verify } from "argon2";
import { prisma } from "@/server/db";
import { GetServerSidePropsContext } from "next";
import { NextAuthOptions, getServerSession, User } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "human" },
        password: { label: "Password", type: "password", placeholder: "human" },
      },
      authorize: async (credentials): Promise<User | null> => {
        console.log("hey");
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          let user;
          user = await prisma.user.findFirst({
            where: { email: email },
          });
          console.log(user);
          if (!user) {
            return null;
          }
          if (user.isVerifed === false) {
            return null;
          }
          const isValidPassword = await verify(user.password, password);

          if (!isValidPassword) {
            return null;
          }
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  debug: env.NODE_ENV === "development",

  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return true;
      }
      return false;
    },

    session: async ({ session, token }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: token.id as string,
        },
        select: {
          password: false,
          id: true,
          email: true,
          credit: true,
          createdAt: true,
          updatedAt: true,
          timeout: true,
          isVerifed: true,
          emailToken: true,
        },
      });
      if (user && user.email !== null) {
        session.user = {
          ...user,
        };
      }
      return session;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
