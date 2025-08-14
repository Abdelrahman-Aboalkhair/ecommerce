import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { combinedSchemas } from "./v1/schema";

const prisma = new PrismaClient();

export async function configureGraphQL(app: express.Application) {
  const apolloServer = new ApolloServer({
    schema: combinedSchemas,
  });
  await apolloServer.start();

  app.use(
    "/api/v1/graphql",
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://ecommerce-nu-rosy.vercel.app"]
          : ["http://localhost:3000", "http://localhost:5173"],
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
      context: async ({ req, res }) => ({
        req,
        res,
        prisma,
        user: (req as any).user,
      }),
    })
  );
}
