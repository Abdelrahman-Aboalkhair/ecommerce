import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/infra/database/database.config";
import { User } from "../types/userTypes";

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("🔍 [OPTIONAL AUTH] optionalAuth middleware called");
  console.log("🔍 [OPTIONAL AUTH] Request headers:", req.headers);
  console.log("🔍 [OPTIONAL AUTH] Request session:", req.session);
  console.log("🔍 [OPTIONAL AUTH] Session ID:", req.session?.id);

  const accessToken = req.cookies.accessToken;
  console.log(
    "🔍 [OPTIONAL AUTH] Access token from header:",
    accessToken ? "present" : "not present"
  );

  if (!accessToken) {
    console.log(
      "🔍 [OPTIONAL AUTH] No access token found, proceeding without auth"
    );
    return next();
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET!;
    if (!secret) {
      console.log(
        "🔍 [OPTIONAL AUTH] ERROR: Access token secret is not defined"
      );
      throw new Error("Access token secret is not defined");
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as User;
    console.log("🔍 [OPTIONAL AUTH] Token decoded successfully:", decoded);

    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
      select: { id: true, role: true },
    });

    console.log("🔍 [OPTIONAL AUTH] User found in database:", user);

    if (user) {
      req.user = user;
      console.log("🔍 [OPTIONAL AUTH] User set in request:", req.user);
    } else {
      console.log("🔍 [OPTIONAL AUTH] User not found in database");
    }
  } catch (error) {
    console.log("🔍 [OPTIONAL AUTH] Error in optionalAuth:", error);
  }

  console.log("🔍 [OPTIONAL AUTH] Proceeding to next middleware");
  next();
};

export default optionalAuth;
