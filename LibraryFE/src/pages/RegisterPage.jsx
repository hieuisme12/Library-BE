import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerStudent } from "../api/authApi";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import Notification from "../components/Notification";

const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function RegisterPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState(initialValues);
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        setNotice(null);
    }, []);

    if (isAuthenticated) {
        return <Navigate to="/books" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = {};
        if (!formData.fullName.trim()) nextErrors.fullName = "Họ và tên là bắt buộc";
        if (!formData.email.trim()) nextErrors.email = "Email là bắt buộc";
        if (!formData.password.trim()) nextErrors.password = "Mật khẩu là bắt buộc";
        if (formData.password !== formData.confirmPassword) {
            nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setBusy(true);
            await registerStudent({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });
            navigate("/login", {
                replace: true,
                state: { notice: { type: "success", message: "Đăng ký sinh viên thành công. Vui lòng đăng nhập." } },
            });
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
                    <p className="eyebrow">Sinh viên</p>
                    <h1>Tạo tài khoản để tra cứu sách</h1>
                    <p>
                        Tài khoản sinh viên chỉ xem được danh sách và chi tiết sách. Nếu bạn cần quyền quản trị sách,
                        hãy đăng ký BOOK_KEEPER bằng mã mời.
                    </p>
                </div>

                <form className="auth-panel card" onSubmit={handleSubmit} noValidate>
                    <div className="form-header auth-header">
                        <div>
                            <p className="eyebrow">Đăng ký</p>
                            <h2>Đăng ký sinh viên</h2>
                        </div>
                        <Link className="btn ghost" to="/login">
                            Quay lại đăng nhập
                        </Link>
                    </div>

                    <Notification notice={notice} onClose={() => setNotice(null)} />

                    <label>
                        <span>Họ và tên</span>
                        <input name="fullName" value={formData.fullName} onChange={handleChange} />
                        {errors.fullName && <small>{errors.fullName}</small>}
                    </label>

                    <label>
                        <span>Email</span>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <small>{errors.email}</small>}
                    </label>

                    <label>
                        <span>Mật khẩu</span>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} />
                        {errors.password && <small>{errors.password}</small>}
                    </label>

                    <label>
                        <span>Xác nhận mật khẩu</span>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
                    </label>

                    <button className="btn primary" type="submit" disabled={busy}>
                        {busy ? "Đang tạo tài khoản..." : "Đăng ký sinh viên"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage;