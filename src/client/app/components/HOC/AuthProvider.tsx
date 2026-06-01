import { useLazyGetMeQuery } from "@/app/store/apis/UserApi";
import { useAppDispatch } from "@/app/store/hooks";
import { logout, setUser } from "@/app/store/slices/AuthSlice";
import { useEffect } from "react";
import { getCurrentDemoUser, isDemoMode } from "@/app/lib/demo";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (isDemoMode()) {
      const user = getCurrentDemoUser();
      if (user) {
        dispatch(setUser({ user }));
      } else {
        dispatch(logout());
      }
      return;
    }

    (async () => {
      try {
        const response = await triggerGetMe().unwrap();
        const user = response.user;
        if (user) {
          dispatch(setUser({ user }));
        } else {
          dispatch(logout());
        }
      } catch (error: unknown) {
        const err = error as { status?: number };
        if (err?.status === 401) {
          dispatch(logout());
        } else {
          console.error("Unexpected error during auth", error);
        }
      }
    })();
  }, [dispatch, triggerGetMe]);

  return <>{children}</>;
}
