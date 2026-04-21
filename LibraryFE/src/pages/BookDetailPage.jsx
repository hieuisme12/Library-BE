import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookById } from "../api/booksApi";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import Notification from "../components/Notification";

const fallbackImage =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80";

function BookDetailPage() {
  const { role } = useAuth();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

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

  if (loading) {
    return (
      <main className="page">
        <p className="loading">Đang tải chi tiết sách...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <Notification notice={notice} onClose={() => setNotice(null)} />

      {!book ? (
        <div className="empty card">Không tìm thấy sách.</div>
      ) : (
        <section className="detail-card card">
          <img
            src={book.imageUrl || fallbackImage}
            alt={book.title}
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
          />

          <div className="detail-content">
            <p className="eyebrow">Chi tiết sách</p>
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
            <p className="description">{book.description}</p>

            <div className="facts">
              <span>ID: {book.id}</span>
              <span>Thể loại: {book.category}</span>
              <span>Nhà xuất bản: {book.publisher}</span>
              <span>Năm xuất bản: {book.publishedYear}</span>
              <span>Số lượng: {book.quantity}</span>
            </div>

            <div className="actions">
              <Link className="btn ghost" to="/books">
                Danh sách
              </Link>
              {role === "BOOK_KEEPER" && (
                <Link className="btn primary" to={`/books/${book.id}/edit`}>
                  Chỉnh sửa
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default BookDetailPage;
