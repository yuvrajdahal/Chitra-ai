import { Resend } from "resend";
import { hash } from "argon2";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { env } from "@/env.mjs";
import sendEmail from "@/utils/emailHandler";
import fs from "fs";

export const handleUserRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please add email",
        });
      }
      if (!password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please add password",
        });
      }
      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });
      if (exists && exists.isVerifed === false) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Please check the mail. A verification mail has been sent before",
        });
      }
      if (exists && exists.isVerifed === true) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists. Try login",
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

      let mailOptions = {
        email: email,
        subject: "Verify your email",
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* Styles for the email template */
    :root {
      --primary-color: #ffad00; /* Updated to amber-700 */
      --text-color: #333333;
      --secondary-color: #718096;
      --bg-color: #f7fafc;
      --button-bg-color: var(--primary-color);
      --button-text-color: #ffffff;
      --button-padding: 10px 20px;
      --button-border-radius: 5px;
      --button-margin-top: 20px;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: var(--bg-color);
      padding: 20px;
    }

    .container {
      max-width: 500px;
      margin: 0 auto;
      text-align: center;
    }

    .heading {
      color: var(--primary-color);
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      vertical-align: middle;
    }

    h4 {
      color: var(--secondary-color);
      font-size: 18px;
      margin-bottom: 20px;
    }

    p {
      color: var(--text-color);
      margin-bottom: 20px;
    }

    .btn {
      display: inline-block;
      background-color: var(--button-bg-color);
      color: var(--button-text-color);
      text-decoration: none;
      padding: var(--button-padding);
      border-radius: var(--button-border-radius);
      margin-top: var(--button-margin-top);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="heading">Chitra Ai</h1>
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
    <h4 class="text-secondary-color text-lg mb-4">Thank you for joining our site</h4>
    <p class="text-text-color mb-4">To get started, please verify your email by clicking the button below:</p>
    <a href="${
      env.NODE_ENV === "development" ? env.DEV_HOST : env.PROD_HOST
    }/api/auth/token?token=${
          result.emailToken
        }" class="btn bg-primary-color text-button-text-color">Verify Email and Then Login</a>
    <p class="text-text-color mt-4">If you did not sign up for an account, please ignore this email.</p>
  </div>
</body>
</html>
`,
      };
      await sendEmail(mailOptions).catch(async (e) => {
        console.log(e);
        await ctx.prisma.user.delete({
          where: {
            id: result.id,
          },
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong please try again.",
        });
      });

      return {
        status: 201,
        message: "Check the mail for the verification link.",
        data: result,
      };
    }),
});
