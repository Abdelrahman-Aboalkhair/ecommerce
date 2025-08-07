export function getErrorMessage(error: unknown): string {
  const err = error as { message?: string; data?: any };

  return (
    err?.message ??
    (typeof err?.data === "string" ? err.data : err?.data?.message) ??
    "Unknown error"
  );
}
