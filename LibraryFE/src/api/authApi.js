import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

const authClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

function normalizeSession(data) {
    return {
        accessToken: data ?.accessToken ?? data ?.access_token ?? "",
        refreshToken: data ?.refreshToken ?? data ?.refresh_token ?? "",
    };
}

export async function login(credentials) {
    const response = await authClient.post("/api/auth/login", {
        username: credentials?.username ?? credentials?.email ?? "",
        password: credentials?.password ?? "",
    });
    return normalizeSession(response.data);
}

export async function refreshSession(refreshToken) {
    const response = await authClient.post("/api/auth/refresh", { refreshToken });
    return normalizeSession(response.data);
}

export async function logoutSession(refreshToken) {
    await authClient.post("/api/auth/logout", { refreshToken });
}

export async function registerStudent(payload) {
    const response = await authClient.post("/api/auth/register", {
        username: payload?.username ?? payload?.email ?? "",
        password: payload?.password ?? "",
    });

    return response.data;
}

export async function registerBookKeeper(payload) {
    const response = await authClient.post(
        "/api/auth/register-bookkeeper",
        {
            username: payload?.username ?? payload?.email ?? "",
            password: payload?.password ?? "",
        },
        {
            headers: {
                "X-Invite-Code": payload?.inviteCode ?? "",
            },
        }
    );

    return response.data;
}