import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import Notification from "../components/Notification";

const initialValues = {
    email: "",
    password: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, role } = useAuth();
    const [formData, setFormData] = useState(initialValues);
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(location.state?.notice || null);

    useEffect(() => {
        if (location.state?.notice) {
            setNotice(location.state.notice);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    if (isAuthenticated) {
        return <Navigate to="/books" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "", ...(name === "email" ? { username: "" } : null) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = {};
        const email = formData.email.trim();
        const password = formData.password;

        if (!email) nextErrors.email = "Email là bắt buộc";
        else if (!emailPattern.test(email)) nextErrors.email = "Email không đúng định dạng";

        if (!password.trim()) nextErrors.password = "Mật khẩu là bắt buộc";
        else if (password.length < 6) nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setBusy(true);
            await login({ email, password });
            const fromPath = location.state?.from?.pathname || "/books";
            navigate(fromPath, { replace: true });
        } catch (error) {
            const errorInfo = getApiErrorDetails(error);
            setNotice({ type: "error", message: errorInfo.message });
            setErrors(errorInfo.fieldErrors);
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="page auth-page">
            <section className="auth-grid">
                <div className="auth-intro card">
                    <p className="eyebrow">Thư viện số</p>
                    <h1>Đăng nhập để quản lý và tra cứu sách</h1>
                    <p>
                        Tài khoản STUDENT chỉ được xem danh sách và chi tiết sách. BOOK_KEEPER có thể tạo, sửa và
                        xóa đầu sách.
                    </p>
                    <div className="auth-points">
                        <span>• Tự động làm mới phiên đăng nhập</span>
                        <span>• Phân quyền theo JWT role</span>
                        <span>• Giao diện tối ưu cho mobile và desktop</span>
                    </div>
                </div>

                <form className="auth-panel card" onSubmit={handleSubmit} noValidate>
                    <div className="form-header auth-header">
                        <div>
                            <p className="eyebrow">Đăng nhập</p>
                            <h2>Chào mừng trở lại</h2>
                        </div>
                        <span className="role-pill muted">{role || "Chưa đăng nhập"}</span>
                    </div>

                    <Notification notice={notice} onClose={() => setNotice(null)} />

                    <label>
                        <span>Email</span>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} />
                        {(errors.email || errors.username) && <small>{errors.email || errors.username}</small>}
                    </label>

                    <label>
                        <span>Mật khẩu</span>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} />
                        {errors.password && <small>{errors.password}</small>}
                    </label>

                    <button className="btn primary" type="submit" disabled={busy}>
                        {busy ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <div className="auth-links">
                        <Link to="/register">Đăng ký sinh viên</Link>
                        <Link to="/register/bookkeeper">Đăng ký người quản lý sách</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;