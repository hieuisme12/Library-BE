import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function ProtectedLayout() {
    const { role, logout, user } = useAuth();

    return (
        <div className="protected-shell">
            <header className="topbar card">
                <div>
                    <p className="eyebrow">Cổng thư viện</p>
                    <h2>Quản lý thư viện</h2>
                </div>

                <div className="topbar-actions">
                    <span className="role-pill">{role || "USER"}</span>
                    {role === "BOOK_KEEPER" && (
                        <Link className="btn accent" to="/books/new">
                            + Thêm sách
                        </Link>
                    )}
                    <button className="btn ghost" type="button" onClick={logout}>
                        Đăng xuất
                    </button>
                </div>
            </header>

            {user?.fullName && <p className="session-note">Xin chào, {user.fullName}</p>}

            <Outlet />
        </div>
    );
}

export default ProtectedLayout;