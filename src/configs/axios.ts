import { getSession } from "@/lib/session";
import axios, { AxiosError } from "axios";

const API_VERSION = "/api/v1";

const axiosConfig = axios.create({
  baseURL: "/api" + API_VERSION,
  headers: {
    Accept: "application/json",
  },
});

axiosConfig.interceptors.request.use(
  async function (config) {
    const session = getSession();
    if (session) {
      config.headers.Authorization = "Bearer " + session;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error: AxiosError) {
    if (error.response) {
      if (error.response.status === 401) {
        // * Unauthorized
        try {
          // logout();
          window.location.href = "/";
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
