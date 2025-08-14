import axios, { AxiosInstance } from "axios";

// Dynamic base URL based on environment
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use environment variables
    return process.env.NODE_ENV === "production"
      ? "https://full-stack-ecommerce-n5at.onrender.com/api/v1"
      : "http://localhost:5000/api/v1";
  }
  // Server-side: default to development
  return "http://localhost:5000/api/v1";
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await axiosInstance.post("/auth/refresh-token");

//         return axios(originalRequest);
//       } catch (refreshError) {
//         console.error("Failed to refresh token", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
