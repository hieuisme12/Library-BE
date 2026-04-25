# Báo cáo ngắn — Library FE (React + Vite)

## 1) Kiến trúc project

**Công nghệ chính**
- React 18 + React Router DOM
- Vite
- Axios
- CSS thuần (styles tập trung)

**Tổ chức thư mục**
- `src/main.jsx`: entry point, mount React
- `src/App.jsx`: định nghĩa routes
- `src/styles.css`: style toàn cục + layout

**Tầng API (gọi Backend)**
- `src/api/httpClient.js`
  - Tạo axios instance dùng chung
  - Gắn `Authorization: Bearer <accessToken>` cho các request (trừ auth endpoints)
  - Tự refresh token khi gặp 401 (tránh logout đột ngột)
- `src/api/authApi.js`
  - Login / Register / Refresh / Logout
  - Đồng bộ với contract BE: dùng `{ username, password }`
  - Register BOOK_KEEPER gửi header `X-Invite-Code`
- `src/api/booksApi.js`
  - CRUD sách + search
  - Normalize field `publishedYear/imageUrl` (hỗ trợ snake_case từ BE)
- `src/api/errorUtils.js`
  - Chuẩn hoá lỗi API (message + fieldErrors)
  - Hỗ trợ nhiều format lỗi validation phổ biến từ Spring Boot

**Tầng Auth & Phân quyền**
- `src/auth/AuthProvider.jsx`
  - Quản lý session: accessToken/refreshToken
  - Decode JWT để lấy role
  - Cung cấp context: `login/logout/isAuthenticated/role/user`
- `src/components/RequireAuth.jsx`, `RequireRole.jsx`, `ProtectedLayout.jsx`
  - Chặn route theo đăng nhập và role

**Pages & Components**
- `src/pages/*`: các màn hình chính (login/register/books/...)
- `src/components/BookForm.jsx`: form dùng chung cho tạo/sửa sách
- `src/components/Notification.jsx`: hiển thị thông báo success/error

---

## 2) Các chức năng đã làm

### Chức năng chính
- Đăng nhập / đăng xuất
- Refresh token tự động khi token hết hạn
- Danh sách sách
- Xem chi tiết sách
- Tạo / sửa / xoá sách (chỉ role `BOOK_KEEPER`)
- Tìm kiếm sách theo keyword
- Hiển thị thông báo thành công/thất bại

### Làm thêm (cộng điểm)
- **Validate dữ liệu nâng cao**
  - Auth: kiểm tra định dạng email, độ dài password (>= 6), confirm password bắt buộc và khớp
  - BookForm: kiểm tra độ dài chuỗi, năm xuất bản là số nguyên trong khoảng hợp lý, số lượng là số nguyên >= 0, mô tả có độ dài tối thiểu, imageUrl là URL http/https hợp lệ
- **Phân trang danh sách sách**
  - Phân trang phía client (mặc định 8 items/trang)
  - Có nút Trước/Sau và hiển thị `Trang x / y`
- **Sắp xếp danh sách sách**
  - Sắp xếp theo **tên sách (A → Z)**
  - Sắp xếp theo **năm xuất bản (mới → cũ)**
- **Thiết kế giao diện đẹp & chuyên nghiệp hơn**
  - Dùng 1 font thống nhất toàn site
  - Fix hiển thị khối intro auth bị mờ
  - Thêm nền ảnh mờ 2 bên (ẩn trên màn nhỏ) để bớt trống
  - Cải thiện style select/pagination

---

## 3) Cách chạy chương trình

### Yêu cầu
- Node.js 18+ và npm

### Cấu hình biến môi trường
1. Tạo file `.env` từ `.env.example`
2. Cấu hình API base URL (đang dùng port 8083):

```env
VITE_API_BASE_URL=http://localhost:8083
```

### Chạy development
```bash
npm install
npm run dev
```

Mặc định FE chạy ở: `http://localhost:5173`

### Build và preview
```bash
npm run build
npm run preview
```

---

## Ghi chú tích hợp Backend
- Auth API phía BE dùng payload `{ username, password }`
- Đăng ký BOOK_KEEPER: endpoint `/api/auth/register-bookkeeper` và header `X-Invite-Code`
- FE đang map **Email UI → username** khi gọi API để phù hợp BE
