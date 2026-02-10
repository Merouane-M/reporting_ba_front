import axios from "axios";
import { API_URL } from "../config/api";
import { getAccessToken, logout } from "../services/auth.service";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
