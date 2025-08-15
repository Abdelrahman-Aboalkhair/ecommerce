import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError";
import prisma from "@/infra/database/database.config";
import { User } from "../types/userTypes";

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req?.cookies?.accessToken;
    console.log("accessToken: ", accessToken);
    if (!accessToken) {
      return next(new AppError(401, "Unauthorized, please log in"));
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as User;

    console.log("Decoded: ", decoded);

    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
      select: { id: true, role: true },
    });

    if (!user) {
      return next(new AppError(401, "User no longer exists."));
    }

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (error) {
    console.log(error);
    return next(new AppError(401, "Invalid access token, please log in"));
  }
};

export default protect;
