import { Request, Response, NextFunction } from "express";
import { RESPONSE_TIMEOUT } from "../constants";

export const requestTimeoutMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timeout = RESPONSE_TIMEOUT;

  // Set timeout for the request
  req.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: "Request timeout",
        error: "REQUEST_TIMEOUT",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Set timeout for the response
  res.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: "Response timeout",
        error: "RESPONSE_TIMEOUT",
        timestamp: new Date().toISOString(),
      });
    }
  });

  next();
};
