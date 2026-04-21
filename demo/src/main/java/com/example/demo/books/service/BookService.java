package com.example.demo.books.service;

import com.example.demo.books.dto.BookCreateRequest;
import com.example.demo.books.dto.BookResponse;
import com.example.demo.books.dto.BookUpdateRequest;
import java.util.List;

public interface BookService {
    List<BookResponse> getAll();

    BookResponse getById(long id);

    BookResponse create(BookCreateRequest request);

    BookResponse update(long id, BookUpdateRequest request);

    void delete(long id);

    List<BookResponse> search(String keyword);
}

