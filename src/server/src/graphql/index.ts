import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { PrismaClient } from "@prisma/client";
import { combinedSchemas } from "./v1/schema";
import { getAllowedOrigins } from "../config/cors";

const prisma = new PrismaClient();

export async function configureGraphQL(app: express.Application) {
  const apolloServer = new ApolloServer({
    schema: combinedSchemas,
  });
  await apolloServer.start();

  app.use(
    "/api/v1/graphql",
    cors({
      origin: getAllowedOrigins(),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Apollo-Require-Preflight",
      ],
    }),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }: { req: express.Request; res: express.Response }) => ({
        req,
        res,
        prisma,
        user: (req as any).user,
      }),
    })
  );
}
