# Báo cáo ngắn – Library API (Spring Boot)

Ngày: 2026-04-25

## 1) Kiến trúc project

### Công nghệ

- Java + Spring Boot 3.4.4
- Spring Web (REST API)
- Spring Security (JWT, stateless)
- Spring Data JPA + Hibernate
- MySQL (JDBC driver: mysql-connector-j)
- JWT: JJWT (io.jsonwebtoken)

### Cấu trúc package

- `com.example.demo`
  - `DemoApplication`: entrypoint
- `com.example.demo.auth`
  - `controller`: REST endpoints auth
  - `dto`: request/response cho auth
  - `entity`: `AppUser`, `RefreshToken`, `Role`
  - `repository`: JPA repositories
  - `security`: JWT service + filter + security config
  - `service`: business logic (register/login/refresh/logout)
- `com.example.demo.books`
  - `controller`: REST endpoints books
  - `dto`: request/response cho books
  - `entity`: `Book`
  - `mapper`: map entity <-> DTO
  - `repository`: JPA repository
  - `service`: CRUD + search
- `com.example.demo.common.exception`
  - `GlobalExceptionHandler`: chuẩn hoá lỗi trả về dạng JSON

### Luồng bảo mật (JWT)

- Client đăng nhập lấy `accessToken` (JWT) và `refreshToken`
- Các API sách yêu cầu header:
  - `Authorization: Bearer <accessToken>`
- Filter JWT đọc claim `role` và set `ROLE_<role>` vào SecurityContext
- Phân quyền:
  - `GET /api/books/**`: `STUDENT` hoặc `BOOK_KEEPER`
  - `POST/PUT/DELETE /api/books/**`: chỉ `BOOK_KEEPER`

## 2) Các chức năng đã làm

### 2.1 Auth

- Đăng ký tài khoản STUDENT: `POST /api/auth/register`
- Đăng ký tài khoản BOOK_KEEPER: `POST /api/auth/register-bookkeeper`
  - Bắt buộc header `X-Invite-Code` đúng với cấu hình `app.security.bookkeeper-invite-code`
- Đăng nhập: `POST /api/auth/login`
  - Trả về `accessToken` + `refreshToken`
- Refresh access token: `POST /api/auth/refresh`
- Logout (revoke refresh token): `POST /api/auth/logout`

### 2.2 Books

- Lấy danh sách sách: `GET /api/books`
- Lấy chi tiết theo id: `GET /api/books/{id}`
- Tìm kiếm theo từ khoá (title/author/category): `GET /api/books/search?keyword=...`
- Tạo mới sách: `POST /api/books`
- Cập nhật sách: `PUT /api/books/{id}`
- Xoá sách: `DELETE /api/books/{id}`

### 2.3 Xử lý lỗi

- Trả lỗi theo format `ApiError` (timestamp/status/error/message/path/fieldErrors)
- Các trường hợp tiêu biểu:
  - 400: validation / IllegalArgumentException
  - 401: sai username/password
  - 403: forbidden
  - 404: không tìm thấy resource

## 3) Cách chạy chương trình

### 3.1 Chuẩn bị

- Cài MySQL, tạo database `librarydb`
- Sửa cấu hình DB trong `src/main/resources/application.properties` nếu cần:
  - `spring.datasource.url`
  - `spring.datasource.username`
  - `spring.datasource.password`

### 3.2 Import dữ liệu mẫu (tuỳ chọn)

- Chạy script SQL: `src/main/resources/db/script.sql`
  - Tạo DB + tables (`books`, `users`, `refresh_tokens`) và insert data mẫu

Ghi chú: App dùng BCrypt để hash mật khẩu khi đăng ký qua API. Nếu tự insert user trong SQL thì `password_hash` nên là BCrypt hash (nếu không, đăng nhập sẽ fail). Cách nhanh nhất để test login là tạo user bằng API `/api/auth/register` hoặc `/api/auth/register-bookkeeper`.

### 3.3 Chạy app bằng Maven Wrapper

Tại thư mục project:

- Windows PowerShell:
  - `./mvnw.cmd -DskipTests spring-boot:run`

Ghi chú:

- Nếu gặp lỗi `JAVA_HOME not found`, cần set `JAVA_HOME` trỏ tới thư mục JDK (ví dụ: `C:\Users\<you>\.jdks\openjdk-25.0.1`).
- Port mặc định hiện tại là `8083` (cấu hình `server.port` trong `application.properties`). Có thể override bằng env `SERVER_PORT`.

Hoặc build jar:
- `./mvnw.cmd -DskipTests package`
- `java -jar target/demo-0.0.1-SNAPSHOT.jar`

### 3.4 Cấu hình JWT secret & invite code

- JWT secret (HS256) tối thiểu 32 ký tự:
  - Env (khuyến nghị): `APP_JWT_SECRET`
  - Fallback dev đã có trong `application.properties`

- Invite code cho BOOK_KEEPER:
  - Env (khuyến nghị): `APP_BOOKKEEPER_INVITE_CODE`
  - Fallback dev hiện tại: `dev-invite-code-change-me`

### 3.5 Test nhanh API (ví dụ)

> Dưới đây là ví dụ dạng pseudo; tuỳ môi trường Windows bạn có thể dùng Postman hoặc `curl.exe`.

1) Đăng ký STUDENT

- `POST /api/auth/register`
- Body:
  ```json
  {"username":"student_test","password":"123456"}
  ```

2) Đăng ký BOOK_KEEPER (cần invite code)

- `POST /api/auth/register-bookkeeper`
- Header: `X-Invite-Code: dev-invite-code-change-me`
- Body:
  ```json
  {"username":"keeper_test","password":"123456"}
  ```

3) Login

- `POST /api/auth/login`
- Body:
  ```json
  {"username":"keeper_test","password":"123456"}
  ```
- Kết quả: `{ "accessToken": "...", "refreshToken": "..." }`

4) Gọi API books

- `GET /api/books` với header:
  - `Authorization: Bearer <accessToken>`

5) Refresh token

- `POST /api/auth/refresh`
- Body:
  ```json
  {"refreshToken":"<refreshToken>"}
  ```

6) Logout

- `POST /api/auth/logout`
- Body:
  ```json
  {"refreshToken":"<refreshToken>"}
  ```
