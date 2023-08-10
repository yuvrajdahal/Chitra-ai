import { createTRPCRouter } from "@/server/api/trpc";
import { stableDiffusionRouter } from "@/server/api/routers/stableDifusion";
import { handleUserRouter } from "@/server/api/routers/userHandler";

export const appRouter = createTRPCRouter({
  stableDiffusion: stableDiffusionRouter,
  userRouter: handleUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
