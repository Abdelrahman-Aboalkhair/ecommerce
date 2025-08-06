import { apiSlice } from "../slices/ApiSlice";
import { setCredentials, clearCredentials } from "../slices/AuthSlice";

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
        dispatch(setCredentials(data));
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
        dispatch(setCredentials(data));
      },
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/sign-out",
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(clearCredentials());
      },
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    checkAuth: builder.mutation<{ accessToken: string; user: User }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data));
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useSignOutMutation,
  useForgotPasswordMutation,
  useCheckAuthMutation,
} = authApi;
