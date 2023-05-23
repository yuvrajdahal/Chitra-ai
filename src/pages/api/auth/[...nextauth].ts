import { env } from "@/env.mjs";
import { PrismaClient, User } from "@prisma/client";
import NextAuth, {
  NextAuthOptions,
  Session,
  User as NextAuthUser,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { authOptions } from "@/server/auth";

const prisma = new PrismaClient();

export default NextAuth(authOptions);
