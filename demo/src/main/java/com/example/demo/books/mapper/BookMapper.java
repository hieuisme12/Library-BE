package com.example.demo.books.mapper;

import com.example.demo.books.dto.BookCreateRequest;
import com.example.demo.books.dto.BookResponse;
import com.example.demo.books.dto.BookUpdateRequest;
import com.example.demo.books.entity.Book;

public final class BookMapper {
    private BookMapper() {
    }

    public static BookResponse toResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setCategory(book.getCategory());
        response.setPublisher(book.getPublisher());
        response.setPublishedYear(book.getPublishedYear());
        response.setQuantity(book.getQuantity());
        response.setDescription(book.getDescription());
        response.setImageUrl(book.getImageUrl());
        response.setCreatedAt(book.getCreatedAt());
        response.setUpdatedAt(book.getUpdatedAt());
        return response;
    }

    public static void applyCreateRequest(Book book, BookCreateRequest request) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setPublisher(request.getPublisher());
        book.setPublishedYear(request.getPublishedYear());
        book.setQuantity(request.getQuantity() == null ? 0 : request.getQuantity());
        book.setDescription(request.getDescription());
        book.setImageUrl(request.getImageUrl());
    }

    public static void applyUpdateRequest(Book book, BookUpdateRequest request) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setPublisher(request.getPublisher());
        book.setPublishedYear(request.getPublishedYear());
        book.setQuantity(request.getQuantity());
        book.setDescription(request.getDescription());
        book.setImageUrl(request.getImageUrl());
    }
}

