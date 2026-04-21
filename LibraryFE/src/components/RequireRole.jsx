import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function RequireRole({ allowedRoles }) {
    const { initializing, isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (initializing) {
        return (
            <main className="page auth-page">
                <div className="auth-panel card">
                    <p className="loading">Đang kiểm tra quyền truy cập...</p>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/forbidden" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default RequireRole;