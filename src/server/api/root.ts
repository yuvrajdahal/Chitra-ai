import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { stableDiffusionRouter } from "@/server/api/routers/stableDifusion";
import { handleUserRouter } from "@/server/api/routers/handleUser";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  stableDiffusion: stableDiffusionRouter,
  userRouter: handleUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
