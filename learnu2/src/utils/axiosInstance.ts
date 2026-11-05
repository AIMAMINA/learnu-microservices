import axios from "axios";
import { API_URL, getToken, handleUnauthorized } from "./api";

/**
 * Axios client for the API gateway.
 * Activity logs are no longer sent from the browser: the gateway records
 * every successful write itself, so they cannot be forged.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) handleUnauthorized();
    return Promise.reject(error);
  },
);

export default api;
