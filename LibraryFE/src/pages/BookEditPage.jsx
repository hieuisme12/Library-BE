import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBookById, updateBook } from "../api/booksApi";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import BookForm from "../components/BookForm";
import Notification from "../components/Notification";

function BookEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [book, setBook] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        const errorInfo = getApiErrorDetails(error);
        setNotice({ type: "error", message: errorInfo.message });
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      setBusy(true);
      setServerErrors({});
      await updateBook(id, payload);
      setNotice({ type: "success", message: "Cập nhật sách thành công" });
      setTimeout(() => navigate(`/books/${id}`), 700);
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
            <p className="eyebrow">Cập nhật</p>
            <h1>Cập nhật sách</h1>
          </div>
          <Link className="btn ghost" to="/books">
            Quay lại danh sách
          </Link>
        </div>

        <Notification notice={notice} onClose={() => setNotice(null)} />

        {loading ? (
          <p className="loading">Đang tải thông tin sách...</p>
        ) : role !== "BOOK_KEEPER" ? (
          <div className="empty">Chỉ BOOK_KEEPER mới được chỉnh sửa sách.</div>
        ) : book ? (
          <BookForm
            initialValues={book}
            submitLabel="Lưu thay đổi"
            onSubmit={handleSubmit}
            busy={busy}
            serverErrors={serverErrors}
            clearServerError={(field) => setServerErrors((prev) => ({ ...prev, [field]: "" }))}
          />
        ) : (
          <div className="empty">Không tìm thấy sách.</div>
        )}
      </div>
    </main>
  );
}

export default BookEditPage;
