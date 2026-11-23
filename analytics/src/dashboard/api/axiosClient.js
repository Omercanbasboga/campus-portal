import axios from "axios";
import mockAdapter from "./mock";

const BFF_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// no backend configured -> serve the bundled sample data
const USE_MOCK = !BFF_BASE_URL || process.env.REACT_APP_USE_MOCK === "true";

const axiosClient = axios.create({
  baseURL: BFF_BASE_URL,
  // the gateway keeps the session in a cookie
  withCredentials: true,
  ...(USE_MOCK && { adapter: mockAdapter }),
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Hatası:", error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
