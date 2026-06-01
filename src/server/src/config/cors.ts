export function getAllowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (fromEnv?.length) {
    return fromEnv;
  }

  return ["http://localhost:3000", "http://localhost:5173"];
}
