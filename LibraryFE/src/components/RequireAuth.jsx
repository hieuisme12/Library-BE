import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function RequireAuth() {
    const { initializing, isAuthenticated } = useAuth();
    const location = useLocation();

    if (initializing) {
        return (
            <main className="page auth-page">
                <div className="auth-panel card">
                    <p className="loading">Đang khôi phục phiên đăng nhập...</p>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default RequireAuth;