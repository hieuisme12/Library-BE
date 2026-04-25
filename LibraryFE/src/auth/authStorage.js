const ACCESS_TOKEN_KEY = "library.accessToken";
const REFRESH_TOKEN_KEY = "library.refreshToken";

function getStorage() {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage;
}

function decodeBase64Url(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return atob(padded);
}

function normalizeRole(rawRole) {
    if (!rawRole) {
        return null;
    }

    if (Array.isArray(rawRole)) {
        return normalizeRole(rawRole[0]);
    }

    const role = String(rawRole).replace(/^ROLE_/, "").trim().toUpperCase();

    if (role === "BOOKKEEPER") {
        return "BOOK_KEEPER";
    }

    return role || null;
}

export function decodeJwtPayload(token) {
    if (!token) {
        return null;
    }

    try {
        const parts = token.split(".");
        if (parts.length < 2) {
            return null;
        }

        return JSON.parse(decodeBase64Url(parts[1]));
    } catch {
        return null;
    }
}

export function getRoleFromToken(token) {
    const payload = decodeJwtPayload(token);
    return normalizeRole(payload ?.role ?? payload ?.roles ?? payload ?.authorities ?? payload ?.scope);
}

export function getAccessToken() {
    return getStorage() ?.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken() {
    return getStorage() ?.getItem(REFRESH_TOKEN_KEY) || "";
}

export function setStoredTokens({ accessToken, refreshToken }) {
    const storage = getStorage();

    if (!storage) {
        return;
    }

    if (accessToken) {
        storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
        storage.removeItem(ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
        storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
        storage.removeItem(REFRESH_TOKEN_KEY);
    }
}

export function clearStoredTokens() {
    const storage = getStorage();

    if (!storage) {
        return;
    }

    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredSession() {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    return {
        accessToken,
        refreshToken,
        role: getRoleFromToken(accessToken),
    };
}