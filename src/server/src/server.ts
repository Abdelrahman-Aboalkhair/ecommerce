import "module-alias/register";
import { createApp } from "./app";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const { httpServer } = await createApp();

  httpServer.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Running in dev mode");
    }
  });

  httpServer.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}

bootstrap();
