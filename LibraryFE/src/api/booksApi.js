import api from "./httpClient";
export { normalizeError }
from "./errorUtils";

function normalizeBook(book) {
    if (!book || typeof book !== "object") {
        return book;
    }

    return {
        ...book,
        publishedYear: book.publishedYear ? ? book.published_year ? ? "",
        imageUrl: book.imageUrl ? ? book.image_url ? ? "",
    };
}

function normalizeBooksResponse(data) {
    if (Array.isArray(data)) {
        return data.map(normalizeBook);
    }

    if (data && Array.isArray(data.content)) {
        return data.content.map(normalizeBook);
    }

    return normalizeBook(data);
}

export async function getBooks() {
    const response = await api.get("/api/books");
    return normalizeBooksResponse(response.data);
}

export async function getBookById(id) {
    const response = await api.get(`/api/books/${id}`);
    return normalizeBook(response.data);
}

export async function createBook(payload) {
    const response = await api.post("/api/books", payload);
    return normalizeBook(response.data);
}

export async function updateBook(id, payload) {
    const response = await api.put(`/api/books/${id}`, payload);
    return normalizeBook(response.data);
}

export async function deleteBook(id) {
    await api.delete(`/api/books/${id}`);
}

export async function searchBooks(keyword) {
    const response = await api.get("/api/books/search", {
        params: { keyword },
    });
    return normalizeBooksResponse(response.data);
}