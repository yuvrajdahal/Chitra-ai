import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const reigisterRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ userName: z.string(), password: z.string() }))
    .query(({ input }) => {}),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
