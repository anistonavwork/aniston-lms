import axios from "axios";

/*
  Automatically detect environment

  Local development:
  http://localhost:5000

  Production:
  https://n8n.anistonav.com/anistonlms
*/

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/anistonlms/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;