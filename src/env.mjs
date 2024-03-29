import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    REPLICATE_API_TOKEN: z.string(),
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    RESEND_EMAIL_API: z.string(),
    DEV_HOST: z.string(),
    PROD_HOST: z.string(),
    SMTPMAILPASS: z.string(),
    SMTPMAIL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    SMTPMAIL: process.env.SMTPMAIL,
    SMTPMAILPASS: process.env.SMTPMAILPASS,
    DATABASE_URL: process.env.DATABASE_URL,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    RESEND_EMAIL_API: process.env.RESEND_EMAIL_API,
    PROD_HOST: process.env.PROD_HOST,
    DEV_HOST: process.env.DEV_HOST,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
});
