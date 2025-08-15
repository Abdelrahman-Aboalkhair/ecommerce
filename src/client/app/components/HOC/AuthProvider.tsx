import { useLazyGetMeQuery } from "@/app/store/apis/UserApi";
import { useAppDispatch } from "@/app/store/hooks";
import { logout, setUser } from "@/app/store/slices/AuthSlice";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    (async () => {
      try {
        const response = await triggerGetMe().unwrap();
        // The backend returns { success, message, user }
        const user = response.user;
        if (user) {
          dispatch(setUser({ user }));
        } else {
          console.error("No user data in response");
          dispatch(logout());
        }
      } catch (error: any) {
        console.log("error: ", error);
        // ✅ If it's a 401, user is unauthenticated — expected
        if (error?.status === 401) {
          dispatch(logout());
        } else {
          console.error("Unexpected error during auth", error);
        }
      }
    })();
  }, []);

  return <>{children}</>;
}
