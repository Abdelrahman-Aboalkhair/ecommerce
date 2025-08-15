import { addAlias } from "module-alias";
import path from "path";

// Dynamically set module alias based on NODE_ENV
const isProduction = process.env.NODE_ENV === "production";
const projectRoot = path.resolve(__dirname, ".."); // Move up from src to project root
const aliasPath = path.join(projectRoot, isProduction ? "dist" : "src");

addAlias("@", aliasPath);

import { createApp } from "./app";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const { httpServer } = await createApp();

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  httpServer.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}

bootstrap();
