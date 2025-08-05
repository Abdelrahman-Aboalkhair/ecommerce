import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuthState, setAccessToken, setUser } from "./AuthSlice";

interface RefreshTokenResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    avatar: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: "https://full-stack-ecommerce-n5at.onrender.com/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const authRoutes = ["/sign-in", "/sign-up", "/password-reset", "/verify-email"];

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";

    const isOnAuthPage = authRoutes.includes(pathname);

    if (isOnAuthPage) {
      // No retry if on auth page
      api.dispatch(clearAuthState());
      return result; // Simply return the 401 error
    }

    // Otherwise, try to refresh
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data: RefreshTokenResponse = refreshResult.data;
      api.dispatch(setAccessToken(data.accessToken));
      api.dispatch(setUser(data.user));
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed
      api.dispatch(clearAuthState());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Product",
    "Category",
    "Cart",
    "Order",
    "Review",
    "Section",
    "Transactions",
    "Logs",
    "Attribute",
    "Variant"
  ],
  endpoints: () => ({}),
});
