import { Request, Response, NextFunction } from "express";
import { API_VERSIONS, DEFAULT_API_VERSION } from "../constants";

export interface VersionedRequest extends Request {
  apiVersion?: string;
}

export const apiVersioningMiddleware = (
  req: VersionedRequest,
  res: Response,
  next: NextFunction
) => {
  // Check for version in URL path
  const pathVersion = req.path.match(/\/api\/v(\d+)/);
  if (pathVersion) {
    req.apiVersion = `v${pathVersion[1]}`;
  }

  // Check for version in headers
  const headerVersion =
    req.headers["x-api-version"] || req.headers["accept-version"];
  if (headerVersion && !req.apiVersion) {
    req.apiVersion = headerVersion as string;
  }

  // Check for version in query parameter
  const queryVersion = req.query.version;
  if (queryVersion && !req.apiVersion) {
    req.apiVersion = queryVersion as string;
  }

  // Set default version if none specified
  if (!req.apiVersion) {
    req.apiVersion = DEFAULT_API_VERSION;
  }

  // Validate version
  const validVersions = Object.values(API_VERSIONS);
  if (!validVersions.includes(req.apiVersion as any)) {
    return res.status(400).json({
      success: false,
      message: `Invalid API version. Supported versions: ${validVersions.join(
        ", "
      )}`,
      supportedVersions: validVersions,
      requestedVersion: req.apiVersion,
    });
  }

  // Add version info to response headers
  res.setHeader("X-API-Version", req.apiVersion);
  res.setHeader("X-API-Supported-Versions", validVersions.join(", "));

  next();
};
