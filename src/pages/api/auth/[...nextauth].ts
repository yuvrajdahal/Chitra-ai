import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
console.log("hey");
export default NextAuth(authOptions);
