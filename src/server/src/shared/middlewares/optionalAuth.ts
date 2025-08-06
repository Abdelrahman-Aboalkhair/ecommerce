import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/infra/database/database.config";
import { User } from "../types/userTypes";

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return next();
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET!;
    if (!secret) {
      throw new Error("Access token secret is not defined");
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as User;
    console.log("decoded => ", decoded);

    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
      select: { id: true, role: true },
    });

    console.log("user => ", user);

    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.log("optionalAuth error => ", error);
  }

  next();
};

export default optionalAuth;
