const SESSION_KEY = "demo-session-user-id";

export function getDemoSessionUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setDemoSessionUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
