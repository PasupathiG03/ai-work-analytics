import axios from "axios";

const API = axios.create({
  // baseURL: "http://backend:8000",
  baseURL: "https://your-backend-url.onrender.com"
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;