import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = String(req.query.token);
    console.log(token);
    const user = await prisma.user.findFirst({
      where: {
        emailToken: token,
      },
    });
    console.log(user);
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailToken: null,

          isVerifed: true,
        },
      });
      res.redirect(
        // process.env.NODE_ENV === "development"
        //   ? process.env.DEV_BASE_URL + "/login"
        //   : process.env.PROD_BASE_URL + "/login"
        "http://localhost:3000"
      );
    } else {
      res.status(404).json({
        status: 404,
        message: "User Not Found",
      });
    }
  }
}
