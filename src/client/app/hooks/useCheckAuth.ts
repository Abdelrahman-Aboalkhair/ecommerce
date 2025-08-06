"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCheckAuthMutation } from "../store/apis/AuthApi";

export function useAuthCheck() {
  const [checkAuth, { isLoading }] = useCheckAuthMutation();
  const accessToken = useSelector((state: any) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken)
      checkAuth()
        .unwrap()
        .catch(() => {}); // Handled by baseQueryWithReauth
  }, [accessToken, checkAuth]);

  return { isLoading };
}
