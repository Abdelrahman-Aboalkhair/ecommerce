import { useAppSelector } from "./state/useRedux";

export function useAuth() {
  const user = useAppSelector((state) => state.auth.user);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined, // hydration in progress
  };
}
