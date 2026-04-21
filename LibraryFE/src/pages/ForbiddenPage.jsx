import { Link } from "react-router-dom";

function ForbiddenPage() {
    return (
        <main className="page auth-page">
            <section className="auth-panel card narrow-panel">
                <p className="eyebrow">403</p>
                <h1>Bạn không có quyền truy cập trang này</h1>
                <p>
                    Tài khoản hiện tại không đủ quyền để mở trang yêu cầu. Hãy quay lại danh sách sách hoặc đăng nhập
                    bằng tài khoản phù hợp.
                </p>
                <div className="actions">
                    <Link className="btn primary" to="/books">
                        Về danh sách sách
                    </Link>
                    <Link className="btn ghost" to="/login">
                        Đăng nhập lại
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default ForbiddenPage;