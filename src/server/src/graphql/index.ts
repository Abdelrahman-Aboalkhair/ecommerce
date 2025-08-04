import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import AppError from "@/shared/errors/AppError";
import { combinedSchemas } from "./v1/schema";

const prisma = new PrismaClient();

export const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_PROD
    : ["http://localhost:3000", "http://localhost:5000"];

export async function configureGraphQL(app: express.Application) {
  // Create ApolloServer for GraphQL queries
  const apolloServer = new ApolloServer({
    schema: combinedSchemas,
  });
  await apolloServer.start();

  // Mount the Express-style GraphQL endpoint
  app.use(
    "/api/v1/graphql",
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins?.includes(origin)) cb(null, true);
        else cb(new AppError(403, "CORS policy violation"));
      },
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
        prisma,
        user: (req as any).user,
      }),
    })
  );
}
