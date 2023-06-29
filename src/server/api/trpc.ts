/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "@/server/db";

type CreateContextOptions = {
  session?: Session | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  // const session=await unstable
  return {
    session: opts.session,
    prisma,
  };
};
/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });
  return createInnerTRPCContext({
    session: session,
  });
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerAuthSession({ req, res });
  return await createContextInner({
    session: session,
  });
};
/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { Session } from "next-auth";
import { getServerAuthSession } from "../auth";
import { PrismaClient } from "@prisma/client";
import { User } from "next-auth";
import { TRPCClientError } from "@trpc/client";
import { add, isAfter, isSameDay } from "date-fns";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
const validateUserAuthentication = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw Error("Not authenticated");
  }
  return next({
    ctx: ctx,
  });
});
const validateUserCredit = t.middleware(async ({ ctx, next }) => {
  const user = ctx.session?.user!;

  if (user.credit <= 0) {
    // Check if the user is already in a timeout period
    if (user.timeout && isAfter(new Date(), user.timeout)) {
      // Check if it's the next day
      const now = new Date();
      const isNextDay = !isSameDay(now, user.timeout);

      if (isNextDay) {
        // Add 50 credits to the user's account
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { credit: user.credit + 50, timeout: null },
        });

        // Proceed to the next middleware
        throw new TRPCError({
          message: `Timeout already set until tomorrow. Try again tomorrow.`,
          code: "BAD_REQUEST",
        });
        // return next({ ctx })
      }

      throw new TRPCError({
        message: "Sorry, you are out of energy. Try again later.",
        code: "BAD_REQUEST",
      });
    }

    // Calculate the timeout period of 1 day
    const timeoutPeriod = add(new Date(), { days: 1 });

    // Update the user's timeout in the database
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: { timeout: timeoutPeriod },
    });

    throw new TRPCError({
      message: "Sorry, you are out of energy. Try again later.",
      code: "BAD_REQUEST",
    });
  }

  return next({ ctx });
});
export const validationProcedure = t.procedure
  .use(validateUserAuthentication)
  .use(validateUserCredit);
export const privateProcedure = t.procedure.use(validateUserAuthentication);
