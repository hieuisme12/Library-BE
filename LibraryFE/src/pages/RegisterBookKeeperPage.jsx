import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerBookKeeper } from "../api/authApi";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import Notification from "../components/Notification";

const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterBookKeeperPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState(initialValues);
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(null);

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
        const fullName = formData.fullName.trim();
        const email = formData.email.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;
        const inviteCode = formData.inviteCode.trim();

        if (!fullName) nextErrors.fullName = "Họ và tên là bắt buộc";
        else if (fullName.length < 2) nextErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";

        if (!email) nextErrors.email = "Email là bắt buộc";
        else if (!emailPattern.test(email)) nextErrors.email = "Email không đúng định dạng";

        if (!password.trim()) nextErrors.password = "Mật khẩu là bắt buộc";
        else if (password.length < 6) nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

        if (!confirmPassword.trim()) nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        else if (password !== confirmPassword) nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

        if (!inviteCode) nextErrors.inviteCode = "Invite code là bắt buộc";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setBusy(true);
            await registerBookKeeper({
                fullName,
                email,
                password,
                inviteCode,
            });
            navigate("/login", {
                replace: true,
                state: { notice: { type: "success", message: "Đăng ký người quản lý sách thành công. Vui lòng đăng nhập." } },
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
                    <p className="eyebrow">BOOK_KEEPER</p>
                    <h1>Đăng ký quyền quản lý sách bằng mã mời</h1>
                    <p>
                        Màn hình này dành cho người được cấp mã mời. Sau khi đăng ký, bạn sẽ có quyền tạo, sửa và xóa
                        đầu sách.
                    </p>
                </div>

                <form className="auth-panel card" onSubmit={handleSubmit} noValidate>
                    <div className="form-header auth-header">
                        <div>
                            <p className="eyebrow">Đăng ký</p>
                            <h2>Đăng ký người quản lý sách</h2>
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
                        {(errors.email || errors.username) && <small>{errors.email || errors.username}</small>}
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

                    <label>
                        <span>Mã mời</span>
                        <input name="inviteCode" value={formData.inviteCode} onChange={handleChange} />
                        {errors.inviteCode && <small>{errors.inviteCode}</small>}
                    </label>

                    <button className="btn primary" type="submit" disabled={busy}>
                        {busy ? "Đang tạo tài khoản..." : "Đăng ký người quản lý sách"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default RegisterBookKeeperPage;