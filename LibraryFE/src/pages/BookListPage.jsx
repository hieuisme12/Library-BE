import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks, searchBooks } from "../api/booksApi";
import { getApiErrorDetails } from "../api/errorUtils";
import { useAuth } from "../auth/AuthProvider";
import Notification from "../components/Notification";

const fallbackImage =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80";

function BookListPage() {
  const { role } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [notice, setNotice] = useState(null);
  const [sortMode, setSortMode] = useState("default");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data || []);
      setPage(1);
    } catch (error) {
      const errorInfo = getApiErrorDetails(error);
      setNotice({ type: "error", message: errorInfo.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const keyword = searchText.trim();
      const data = keyword ? await searchBooks(keyword) : await getBooks();
      setBooks(data || []);
      setPage(1);
    } catch (error) {
      const errorInfo = getApiErrorDetails(error);
      setNotice({ type: "error", message: errorInfo.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sách này?");
    if (!confirmed) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      setNotice({ type: "success", message: "Xóa sách thành công" });
    } catch (error) {
      const errorInfo = getApiErrorDetails(error);
      setNotice({ type: "error", message: errorInfo.message });
    }
  };

  const totalQuantity = useMemo(
    () => books.reduce((sum, current) => sum + (Number(current.quantity) || 0), 0),
    [books]
  );

  const sortedBooks = useMemo(() => {
    const next = [...books];

    if (sortMode === "title") {
      next.sort((a, b) => {
        const aTitle = String(a?.title ?? "").trim();
        const bTitle = String(b?.title ?? "").trim();
        return aTitle.localeCompare(bTitle, "vi", { sensitivity: "base" });
      });
    } else if (sortMode === "publishedYear") {
      next.sort((a, b) => {
        const aYear = Number(a?.publishedYear);
        const bYear = Number(b?.publishedYear);
        const aValid = Number.isFinite(aYear);
        const bValid = Number.isFinite(bYear);

        if (!aValid && !bValid) return 0;
        if (!aValid) return 1;
        if (!bValid) return -1;

        return bYear - aYear;
      });
    }

    return next;
  }, [books, sortMode]);

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedBooks = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedBooks.slice(start, start + pageSize);
  }, [safePage, sortedBooks]);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Bảng điều khiển thư viện</p>
        <h1>Quản lý sách thông minh</h1>
        <p>
          Theo dõi kho sách, cập nhật thông tin nhanh và tìm kiếm chỉ trong vài giây.
        </p>
      </header>

      <Notification notice={notice} onClose={() => setNotice(null)} />

      <section className="toolbar card">
        <form onSubmit={handleSearch} className="search-form">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Tìm theo tên sách, tác giả, thể loại..."
          />
          <button className="btn primary" type="submit">
            Tìm kiếm
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setSearchText("");
              loadBooks();
            }}
          >
            Làm mới
          </button>
        </form>

        <div className="summary">
          <span>Tổng đầu sách: {books.length}</span>
          <span>Tổng số lượng: {totalQuantity}</span>

          <label className="inline-field">
            <span>Sắp xếp</span>
            <select
              value={sortMode}
              onChange={(event) => {
                setSortMode(event.target.value);
                setPage(1);
              }}
            >
              <option value="default">Mặc định</option>
              <option value="title">Tên sách (A → Z)</option>
              <option value="publishedYear">Năm xuất bản (mới → cũ)</option>
            </select>
          </label>

          {role === "BOOK_KEEPER" && (
            <Link to="/books/new" className="btn accent">
              + Thêm sách mới
            </Link>
          )}
        </div>
      </section>

      {loading ? (
        <p className="loading">Đang tải dữ liệu...</p>
      ) : books.length === 0 ? (
        <div className="empty card">Không tìm thấy sách phù hợp.</div>
      ) : (
        <>
          <section className="book-grid">
          {pagedBooks.map((book) => (
            <article key={book.id} className="book-card">
              <img
                src={book.imageUrl || fallbackImage}
                alt={book.title}
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />
              <div className="content">
                <span className="chip">#{book.id}</span>
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <p>{book.description}</p>
                <ul>
                  <li>Thể loại: {book.category}</li>
                  <li>NXB: {book.publisher}</li>
                  <li>Năm: {book.publishedYear}</li>
                  <li>Số lượng: {book.quantity}</li>
                </ul>
                <div className="actions">
                  <Link className="btn ghost" to={`/books/${book.id}`}>
                    Chi tiết
                  </Link>
                  {role === "BOOK_KEEPER" && (
                    <>
                      <Link className="btn ghost" to={`/books/${book.id}/edit`}>
                        Sửa
                      </Link>
                      <button className="btn danger" onClick={() => handleDelete(book.id)}>
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
          </section>

          <div className="pagination card">
            <button
              className="btn ghost"
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Trước
            </button>
            <span>
              Trang {safePage} / {totalPages}
            </span>
            <button
              className="btn ghost"
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Sau
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default BookListPage;
