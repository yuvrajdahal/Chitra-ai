import Replicate from "replicate";
import { env } from "@/env.mjs";
import { z } from "zod";
import fs from "fs";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
  validationProcedure,
} from "@/server/api/trpc";
import { axiosApiHandler } from "@/utils/api";
import axios from "axios";
import { TRPCClientError } from "@trpc/client";
import https from "https";
import path from "path";
import { Readable } from "stream";
import { ErrorProps } from "next/error";
import { IncomingMessage } from "http";
import { Configuration, OpenAIApi } from "openai";
import { getSession } from "next-auth/react";
import { add, formatDistanceToNow, isAfter, isSameDay } from "date-fns";

const http = require("http");

function downloadImage(url: string, destinationPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    const file = fs.createWriteStream(destinationPath);

    protocol
      .get(url, (response: IncomingMessage) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          fs.chmodSync(destinationPath, 0o666); // Set file permissions for read and write

          resolve();
        });
      })
      .on("error", (error: Error) => {
        fs.unlink(destinationPath, () => {
          reject(error);
        });
      });
  });
}
export const stableDiffusionRouter = createTRPCRouter({
  textToImage: validationProcedure
    .input(
      z.object({
        text: z.string(),
        size: z.enum(["256x256", "512x512", "1024x1024"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const replicate = new Replicate({
          auth: env.REPLICATE_API_TOKEN,
        });
        const height = input.size.split("x")[0];
        const width = input.size.split("x")[1];
        const output: any = await replicate.run(
          "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          {
            input: {
              width: height?.toString,
              height: width?.toString,
              prompt: input.text,
              refine: "expert_ensemble_refiner",
              scheduler: "K_EULER",
              lora_scale: 0.6,
              num_outputs: 1,
              guidance_scale: 7.5,
              apply_watermark: false,
              high_noise_frac: 0.8,
              negative_prompt: "",
              prompt_strength: 0.8,
              num_inference_steps: 25,
            },
          }
        );
        // const aiRes = await openAi.createImage({
        //   prompt: input.text,
        //   n: 1,
        //   size: input.size,
        // });
        const image = output[0] as string;
        const updatedUser = await ctx.prisma.user.update({
          where: { id: ctx.session?.user.id },
          data: { credit: { decrement: 5 } },
        });
        return { credit: updatedUser.credit, data: image };
      } catch (e: any) {
        if (e.response.status === 429) {
          throw new Error(
            "You exceeded your generation limit. Try again sometime"
          );
        }
        throw new Error(e?.message);
      }
    }),
  regenerate: validationProcedure
    .input(
      z.object({
        text: z.string(),
        size: z.enum(["256x256", "512x512", "1024x1024"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const aiRes = await openAi.createImage({
          prompt: input.text,
          n: 1,
          size: input.size,
        });

        const image = aiRes.data.data[0]?.url;
        await ctx.prisma.user.update({
          where: { id: ctx.session?.user.id },
          data: { credit: { decrement: 5 } },
        });
        return { data: image };
      } catch (e: any) {
        throw new Error(e?.message);
      }
    }),
  checkForCredit: validationProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      try {
        const user = ctx.session?.user!;
        const now = new Date();
        if (user.timeout !== null) {
          const isNextDay =
            isSameDay(now, user.timeout) && isAfter(now, user.timeout);

          if (isNextDay) {
            const updatedUser = await ctx.prisma.user.update({
              where: { id: user.id },
              data: { credit: user.credit + 50, timeout: null },
            });
            return {
              data: "The credit has been restored",
              credit: updatedUser.credit,
            };
          }
        }
      } catch (e: any) {
        throw new Error(e?.message);
      }
    }),
});

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openAi = new OpenAIApi(configuration);
