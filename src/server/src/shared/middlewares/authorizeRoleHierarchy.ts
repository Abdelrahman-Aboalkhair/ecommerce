import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import prisma from "@/infra/database/database.config";

const getRoleHierarchy = (role: string): number => {
  const hierarchy: { [key: string]: number } = {
    USER: 1,
    ADMIN: 2,
    SUPERADMIN: 3,
  };
  return hierarchy[role] || 0;
};

const authorizeRoleHierarchy = (minRequiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError(401, "Unauthorized: No user found"));
      }

      const userRole = req.user.role;
      const targetUserId = req.params.id;

      if (!targetUserId) {
        return next(new AppError(400, "Target user ID is required"));
      }

      // Get target user's role
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { role: true },
      });

      if (!targetUser) {
        return next(new AppError(404, "Target user not found"));
      }

      // Check if user has minimum required role
      if (getRoleHierarchy(userRole) < getRoleHierarchy(minRequiredRole)) {
        return next(
          new AppError(403, "You are not authorized to perform this action")
        );
      }

      // Prevent modifying users with equal or higher roles
      if (getRoleHierarchy(targetUser.role) >= getRoleHierarchy(userRole)) {
        return next(
          new AppError(
            403,
            "Cannot modify users with equal or higher privileges"
          )
        );
      }

      next();
    } catch (error) {
      return next(new AppError(500, "Internal server error"));
    }
  };
};

export default authorizeRoleHierarchy;
