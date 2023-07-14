import { env } from "@/env.mjs";
import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  from?: string;
  email: string;
  subject: string;
  message?: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      port: 2525,
      auth: {
        user: env.SMTPMAIL,
        pass: env.SMTPMAILPASS,
      },
    });

    const message = {
      from: options.from ? options.from : `Chitra ai <${env.SMTPMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
  } catch (error: any) {
    throw Error(error.message);
  }
};

export default sendEmail;
