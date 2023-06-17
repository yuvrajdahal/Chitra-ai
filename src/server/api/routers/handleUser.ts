import { Resend } from "resend";
import { hash } from "argon2";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { env } from "@/env.mjs";

const resend = new Resend(env.RESEND_EMAIL_API);

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
      const emailToken = crypto.randomBytes(5).toString("hex");
      const token = crypto
        .createHash("sha256")
        .update(emailToken)
        .digest("hex");
      const result = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          emailToken: token,
          isVerifed: false,
        },
      });
      const sentEmail = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Hello World",
        html: `<h2>${result.email} Thanks for catchin up to our site</h2>
      <h4>Please verify your email</h4>
      <a href="${
        env.NODE_ENV === "development" ? env.DEV_HOST : env.PROD_HOST
      }/api/auth/token?token=${result.emailToken}">Veriy email</a>
    `,
      });

      return {
        status: 201,
        message: "Account created successfully",
        data: result,
      };
    }),
});
