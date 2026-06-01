const DEV_API_URL = "http://localhost:5000/api/v1";
const DEV_SOCKET_URL = "http://localhost:5000";

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD || DEV_API_URL
    : process.env.NEXT_PUBLIC_API_URL_DEV || DEV_API_URL;

export const AUTH_API_BASE_URL = API_BASE_URL;

export const GRAPHQL_URL = `${API_BASE_URL}/graphql`;

export const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || DEV_SOCKET_URL;
