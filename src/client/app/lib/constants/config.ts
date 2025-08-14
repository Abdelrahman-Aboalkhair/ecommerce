const DEV_API_URL = "http://localhost:5000/api/v1";
const PROD_API_URL = "https://full-stack-ecommerce-n5at.onrender.com/api/v1";

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD || PROD_API_URL
    : process.env.NEXT_PUBLIC_API_URL_DEV || DEV_API_URL;

export const AUTH_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD || PROD_API_URL
    : process.env.NEXT_PUBLIC_API_URL_DEV || DEV_API_URL;

export const GRAPHQL_URL = `${API_BASE_URL}/graphql`;
