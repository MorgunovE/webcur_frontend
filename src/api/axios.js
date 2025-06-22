import axios from "axios";

const LOCAL_URL = process.env.VUE_APP_API_URL || "http://localhost:5000";
const REMOTE_URL = process.env.VUE_APP_API_URL_REMOTE || "https://webcur-backend.onrender.com";

let apiBaseUrl = LOCAL_URL;

async function detectApiBaseUrl() {
  try {
    await axios.get(`${LOCAL_URL}/health`, { timeout: 2000 });
    apiBaseUrl = LOCAL_URL;
  } catch {
    try {
      await axios.get(`${REMOTE_URL}/health`, { timeout: 2000 });
      apiBaseUrl = REMOTE_URL;
    } catch {
      apiBaseUrl = LOCAL_URL;
    }
  }
  instance.defaults.baseURL = apiBaseUrl;
}

const instance = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

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

export { detectApiBaseUrl };
export default instance;