import { hash } from "argon2";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const handleUserRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }
      const hashedPassword = await hash(password);
      const result = await ctx.prisma.user.create({
        data: { email, password: hashedPassword },
      });
      return {
        status: 201,
        message: "Account created successfully",
        result: result,
      };
    }),
});
