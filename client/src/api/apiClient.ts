// src/lib/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust this to your Express.js server URL
});

export default apiClient;
