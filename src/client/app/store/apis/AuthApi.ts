import { apiSlice } from "../slices/ApiSlice";
import { setUser, logout } from "../slices/AuthSlice";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  avatar: string | null;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { accessToken: string; user: User },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        // Backend returns { success, message, user }
        dispatch(setUser({ user: data.user }));
      },
    }),
    signup: builder.mutation<
      { accessToken: string; user: User },
      { name: string; email: string; password: string }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        // Backend returns { success, message, user }
        dispatch(setUser({ user: data.user }));
      },
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/sign-out",
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(logout());
      },
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    checkAuth: builder.mutation<{ accessToken: string; user: User }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        // Backend returns { success, message, user }
        dispatch(setUser({ user: data.user }));
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useSignOutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCheckAuthMutation,
} = authApi;
