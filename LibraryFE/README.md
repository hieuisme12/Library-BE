# Library FE (React + Vite)

Frontend quan ly sach ket noi voi Spring Boot API:

- GET /api/books
- GET /api/books/{id}
- POST /api/books
- PUT /api/books/{id}
- DELETE /api/books/{id}
- GET /api/books/search?keyword=

## Chuc nang

- Danh sach sach
- Them moi sach
- Cap nhat sach
- Xoa sach (co xac nhan)
- Xem chi tiet sach
- Tim kiem sach theo keyword
- Hien thi anh qua image_url
- Thong bao thanh cong/that bai khi CRUD

## Cai dat

Yeu cau: Node.js 18+ va npm

1. Cai dependencies

```bash
npm install
```

2. Tao file .env tu .env.example va cau hinh API

```env
VITE_API_BASE_URL=http://localhost:8083
```

3. Chay dev server

```bash
npm run dev
```

## Cau truc thu muc

- src/api/booksApi.js: Goi API va xu ly loi
- src/components/BookForm.jsx: Form them/sua sach dung chung
- src/components/Notification.jsx: Thanh thong bao
- src/pages/BookListPage.jsx: Danh sach, tim kiem, xoa
- src/pages/BookCreatePage.jsx: Them sach
- src/pages/BookEditPage.jsx: Sua sach
- src/pages/BookDetailPage.jsx: Chi tiet sach
