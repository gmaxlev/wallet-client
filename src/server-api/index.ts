import axios, { AxiosError, AxiosInstance } from "axios";
import config from "../config";
import auth from "./auth";
import user from "./user";

const client = axios.create({
  baseURL: config.API.HOST,
  withCredentials: true,
});

const refreshToken = () => {
  return client.post("/auth/refresh", null, {
    _isRefreshRequest_: true,
  } as any);
};

let refreshTokenRequest: Promise<unknown> | null = null;

client.interceptors.response.use(
  (config) => config,
  (axiosError: AxiosError) => {
    if (
      axiosError.response?.status !== 401 ||
      (axiosError.config as any)._isRefreshRequest_
    ) {
      throw axiosError;
    }

    if (!refreshTokenRequest) {
      refreshTokenRequest = refreshToken();
    }

    return refreshTokenRequest
      .then(() => {
        return client.request(axiosError.config);
      })
      .finally(() => {
        refreshTokenRequest = null;
      });
  }
);

const api = {
  auth: auth(client),
  user: user(client),
};

export default api;
