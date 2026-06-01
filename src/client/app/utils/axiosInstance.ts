import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "@/app/lib/constants/config";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
