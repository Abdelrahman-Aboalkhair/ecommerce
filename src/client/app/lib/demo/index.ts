export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export {
  DEMO_ACCOUNT_EMAILS,
  DEMO_USERS,
  findDemoUserByEmail,
} from "./seed";
export {
  getDemoState,
  setDemoState,
  resetDemoState,
  getCurrentDemoUser,
  getCartOwnerKey,
  loginDemoUser,
  logoutDemoUser,
  demoId,
} from "./store";
export {
  getDemoSessionUserId,
  setDemoSessionUserId,
  clearDemoSession,
} from "./session";
