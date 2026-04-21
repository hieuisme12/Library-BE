import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest, logoutSession, refreshSession } from "../api/authApi";
import { clearStoredTokens, decodeJwtPayload, getStoredSession, setStoredTokens } from "./authStorage";

const AuthContext = createContext(null);

function getUserFromToken(token) {
    const payload = decodeJwtPayload(token);

    if (!payload) {
        return null;
    }

    const rawRole = payload.role ?? payload.roles ?? payload.authorities ?? payload.scope;
    const role = Array.isArray(rawRole)
        ? String(rawRole[0] || "").replace(/^ROLE_/, "").trim().toUpperCase()
        : String(rawRole || "").replace(/^ROLE_/, "").trim().toUpperCase();

    return {
        id: payload.sub ?? payload.userId ?? payload.id ?? null,
        email: payload.email ?? payload.sub ?? "",
        fullName: payload.fullName ?? payload.name ?? payload.username ?? "",
        role: role === "BOOKKEEPER" ? "BOOK_KEEPER" : role || null,
        payload,
    };
}

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const storedSession = getStoredSession();
    const [accessToken, setAccessToken] = useState(storedSession.accessToken);
    const [refreshToken, setRefreshToken] = useState(storedSession.refreshToken);
    const [user, setUser] = useState(() => (storedSession.accessToken ? getUserFromToken(storedSession.accessToken) : null));
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            if (!storedSession.refreshToken) {
                setInitializing(false);
                return;
            }

            try {
                const session = await refreshSession(storedSession.refreshToken);
                if (cancelled) {
                    return;
                }

                setStoredTokens(session);
                setAccessToken(session.accessToken);
                setRefreshToken(session.refreshToken);
                setUser(getUserFromToken(session.accessToken));
            } catch {
                if (cancelled) {
                    return;
                }

                clearStoredTokens();
                setAccessToken("");
                setRefreshToken("");
                setUser(null);
            } finally {
                if (!cancelled) {
                    setInitializing(false);
                }
            }
        };

        bootstrap();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (credentials) => {
        const session = await loginRequest(credentials);
        setStoredTokens(session);
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
        setUser(getUserFromToken(session.accessToken));
    };

    const logout = async () => {
        try {
            if (refreshToken) {
                await logoutSession(refreshToken);
            }
        } catch {
            // Ignore logout revocation failures and clear local session anyway.
        } finally {
            clearStoredTokens();
            setAccessToken("");
            setRefreshToken("");
            setUser(null);
            navigate("/login", { replace: true });
        }
    };

    const value = useMemo(
        () => ({
            accessToken,
            refreshToken,
            user,
            role: user?.role || null,
            isAuthenticated: Boolean(accessToken && user),
            initializing,
            login,
            logout,
        }),
        [accessToken, refreshToken, user, initializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}