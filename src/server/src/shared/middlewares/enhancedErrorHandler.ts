import { Request, Response, NextFunction } from "express";
import logger from "../../infra/winston/logger";
import { DeviceRequest } from "./deviceDetection";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export const enhancedErrorHandler = (
  err: AppError,
  req: DeviceRequest,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    deviceInfo: req.deviceInfo,
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = {
      message,
      statusCode: 404,
      code: "RESOURCE_NOT_FOUND",
    } as AppError;
  }

  // Mongoose duplicate key
  // if (err.code === 11000) {
  //   const message = "Duplicate field value entered";
  //   error = { message, statusCode: 400, code: "DUPLICATE_FIELD" } as AppError;
  // }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error = { message, statusCode: 400, code: "VALIDATION_ERROR" } as AppError;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401, code: "INVALID_TOKEN" } as AppError;
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401, code: "TOKEN_EXPIRED" } as AppError;
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";

  // Enhanced error response based on device type
  const errorResponse: any = {
    success: false,
    error: {
      message,
      code: error.code || "INTERNAL_SERVER_ERROR",
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error.stack = err.stack;
  }

  // Add device-specific information
  if (req.deviceInfo) {
    errorResponse.error.device = {
      type: req.deviceInfo.type,
      platform: req.deviceInfo.platform,
      browser: req.deviceInfo.browser,
    };
  }

  // Add helpful links for common errors
  if (error.code === "RESOURCE_NOT_FOUND") {
    errorResponse.error.help = {
      message:
        "The requested resource was not found. Please check the URL and try again.",
      links: [
        { rel: "documentation", href: "/api/docs" },
        { rel: "support", href: "/support" },
      ],
    };
  }

  if (error.code === "VALIDATION_ERROR") {
    errorResponse.error.help = {
      message:
        "Please check your input data and ensure all required fields are provided.",
      links: [
        { rel: "documentation", href: "/api/docs" },
        { rel: "schema", href: "/api/schema" },
      ],
    };
  }

  // Set appropriate headers
  res.setHeader("X-Error-Code", error.code || "INTERNAL_SERVER_ERROR");
  res.setHeader("X-Error-Type", error.name || "Error");

  res.status(statusCode).json(errorResponse);
};
