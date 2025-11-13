import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // you can increase a bit
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor with authentication
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded but with an error status
            if (error.response.status === 401) {
                // Do nothing - let components handle the error
            } else if (error.response.status === 500) {
                console.error("Server error");
            }
        } else if (error.request) {
            // Request made but no response
            console.error("No response from server:", error.request);
        } else {
            // Something went wrong in setting up the request
            console.error("Axios error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
