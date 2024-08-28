// src/api/apiClient.ts
// Function: Setup API client
// Expected Output: Axios instance with base URL and headers

import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://api.example.com";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
