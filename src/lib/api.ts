import axios from "axios";

export const api = axios.create({
  baseURL: "https://test-fe.mysellerpintar.com/api",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
