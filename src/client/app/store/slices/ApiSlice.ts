import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "./AuthSlice";

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    avatar: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken, user } = refreshResult.data as AuthResponse;
      api.dispatch(setCredentials({ accessToken, user }));
      result = await baseQuery(args, api, extraOptions); // Retry original request
    } else {
      api.dispatch(clearCredentials());
      if (
        typeof window !== "undefined" &&
        !["/sign-in", "/sign-up"].includes(window.location.pathname)
      ) {
        window.location.href = "/sign-in"; // Redirect to login on failure
      }
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
    "Variant",
  ],
  endpoints: () => ({}),
});
