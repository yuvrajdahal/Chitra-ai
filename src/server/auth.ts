import { verify } from "argon2";
import { prisma } from "@/server/db";
import { GetServerSidePropsContext } from "next";
import {
  DefaultSession,
  NextAuthOptions,
  getServerSession,
  User,
} from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Session } from "inspector";
import { env } from "@/env.mjs";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

// interface SessionType extends Session {
//   user: {
//     id: string;
//     credit: number;
//     // Add other properties specific to your user schema
//     email: string;
//   };
// }
// declare module "next-auth" {
//   interface User {}

//   interface Session {
//     user: {
//       id: string;
//       credit: number;
//       email: string;
//       password?: string;
//       createdAt: Date;
//       updatedAt: Date;
//     };
//     expires: ISODateString;
//   }
// }
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       credit: number; // Add the 'credit' property

//       // ...other properties
//       // role: UserRole;
//     };
//   }

//   interface User {
//     // ...other properties
//     id: string;
//     credit: number;
//     // role: UserRole;
//   }
// }
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "human" },
        password: { label: "Password", type: "password", placeholder: "human" },
      },
      authorize: async (credentials): Promise<User | null> => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          let user;
          user = await prisma.user.findFirst({
            where: { email: email },
          });

          if (!user) {
            return null;
          }
          const isValidPassword = await verify(user.password, password);

          if (!isValidPassword) {
            return null;
          }
          console.log(user);
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
      console.log("session");
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

export const isAuth = false;
