import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Intercepteur pour inclure le token JWT dans chaque requête si présent
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
