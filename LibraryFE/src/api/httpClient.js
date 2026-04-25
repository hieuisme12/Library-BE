import axios from "axios";
import { clearStoredTokens, getAccessToken, getRefreshToken, setStoredTokens } from "../auth/authStorage";
import { refreshSession } from "./authApi";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise = null;

function isAuthEndpoint(url = "") {
    return url.includes("/api/auth/");
}

function redirectToLogin() {
    if (typeof window === "undefined") {
        return;
    }

    if (window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
}

api.interceptors.request.use((config) => {
    const requestUrl = config.url || "";

    if (!isAuthEndpoint(requestUrl)) {
        const accessToken = getAccessToken();

        if (accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            };
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const response = error ?.response;
        const originalRequest = error ?.config;

        if (!response || response.status !== 401 || !originalRequest || isAuthEndpoint(originalRequest.url || "")) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            clearStoredTokens();
            redirectToLogin();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            refreshPromise = refreshPromise || refreshSession(refreshToken);
            const session = await refreshPromise;
            refreshPromise = null;
            setStoredTokens(session);

            originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${session.accessToken}`,
            };

            return api(originalRequest);
        } catch (refreshError) {
            refreshPromise = null;
            clearStoredTokens();
            redirectToLogin();
            return Promise.reject(refreshError);
        }
    }
);

export default api;