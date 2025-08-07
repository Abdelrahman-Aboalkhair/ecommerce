import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./AuthSlice";

// development: http://localhost:5000/api/v1
// production: https://full-stack-ecommerce-n5at.onrender.com/api/v1
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try refresh the token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // If there's data, retry the original req with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If there's no data, log out
      api.dispatch(logout());
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
