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
        from: "chitraai@gmail.dev",
        to: email,
        subject: "Verify your email",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* Styles for the email template */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    }

    h2 {
      color: #333333;
    }

    h4 {
      color: #777777;
    }

    a {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h2>${result.email}</h2>
  <h4>Thanks for catching up to our site</h4>
  <p>Please verify your email by clicking the button below:</p>
  <a href="${
    env.NODE_ENV === "development" ? env.DEV_HOST : env.PROD_HOST
  }/api/auth/token?token=${result.emailToken}">Verify Email</a>
</body>
</html>

    `,
      });

      return {
        status: 201,
        message: "Account created successfully",
        data: result,
      };
    }),
});
