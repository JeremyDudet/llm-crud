// src/api/apiClient.ts
import axios from "axios";
import { store } from "../store";
import { clearUser } from "../features/user/userSlice";

const baseURL = "http://localhost:3001";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, clear the token and log out
      store.dispatch(clearUser());
    }
    return Promise.reject(error);
  }
);

export default apiClient;
