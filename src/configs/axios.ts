import { getSessionHrd } from "@/lib/session";
import axios, { AxiosError } from "axios";

const API_VERSION = "/v1";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosConfig = axios.create({
  baseURL: API_URL + API_VERSION,
  headers: {
    Accept: "application/json",
  },
});

axiosConfig.interceptors.request.use(
  async function (config) {
    const session = getSessionHrd();
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
    return Promise.reject(error);
  }
);

export default axiosConfig;
