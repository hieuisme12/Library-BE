import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedLayout from "./components/ProtectedLayout";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import ForbiddenPage from "./pages/ForbiddenPage";
import LoginPage from "./pages/LoginPage";
import BookCreatePage from "./pages/BookCreatePage";
import BookDetailPage from "./pages/BookDetailPage";
import BookEditPage from "./pages/BookEditPage";
import BookListPage from "./pages/BookListPage";
import RegisterBookKeeperPage from "./pages/RegisterBookKeeperPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/bookkeeper" element={<RegisterBookKeeperPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />

            <Route element={<RequireRole allowedRoles={["BOOK_KEEPER"]} />}>
              <Route path="/books/new" element={<BookCreatePage />} />
              <Route path="/books/:id/edit" element={<BookEditPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
