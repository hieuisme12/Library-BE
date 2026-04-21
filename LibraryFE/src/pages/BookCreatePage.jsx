import { Link, useNavigate } from "react-router-dom";
import { createBook } from "../api/booksApi";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import BookForm from "../components/BookForm";
import Notification from "../components/Notification";
import { useState } from "react";

function BookCreatePage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [serverErrors, setServerErrors] = useState({});

  const handleSubmit = async (payload) => {
    try {
      setBusy(true);
      setServerErrors({});
      await createBook(payload);
      setNotice({ type: "success", message: "Thêm sách thành công" });
      setTimeout(() => navigate("/books"), 700);
    } catch (error) {
      const errorInfo = getApiErrorDetails(error);
      setNotice({ type: "error", message: errorInfo.message });
      setServerErrors(errorInfo.fieldErrors);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <div className="form-page card">
        <div className="form-header">
          <div>
            <p className="eyebrow">Tạo mới</p>
            <h1>Thêm sách mới</h1>
          </div>
          <Link className="btn ghost" to="/books">
            Quay lại danh sách
          </Link>
        </div>

        <Notification notice={notice} onClose={() => setNotice(null)} />

        {role !== "BOOK_KEEPER" ? (
          <div className="empty card">Chỉ BOOK_KEEPER mới được tạo sách.</div>
        ) : (
          <BookForm
            submitLabel="Lưu sách"
            onSubmit={handleSubmit}
            busy={busy}
            serverErrors={serverErrors}
            clearServerError={(field) => setServerErrors((prev) => ({ ...prev, [field]: "" }))}
          />
        )}
      </div>
    </main>
  );
}

export default BookCreatePage;
