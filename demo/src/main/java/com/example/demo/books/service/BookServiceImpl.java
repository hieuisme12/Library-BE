package com.example.demo.books.service;

import com.example.demo.books.dto.BookCreateRequest;
import com.example.demo.books.dto.BookResponse;
import com.example.demo.books.dto.BookUpdateRequest;
import com.example.demo.books.entity.Book;
import com.example.demo.books.mapper.BookMapper;
import com.example.demo.books.repository.BookRepository;
import com.example.demo.common.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> getAll() {
        return bookRepository.findAll().stream().map(BookMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponse getById(long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: id=" + id));
        return BookMapper.toResponse(book);
    }

    @Override
    @Transactional
    public BookResponse create(BookCreateRequest request) {
        Book book = new Book();
        BookMapper.applyCreateRequest(book, request);
        return BookMapper.toResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public BookResponse update(long id, BookUpdateRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: id=" + id));
        BookMapper.applyUpdateRequest(book, request);
        return BookMapper.toResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void delete(long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found: id=" + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAll();
        }
        String trimmed = keyword.trim();
        return bookRepository
                .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                        trimmed, trimmed, trimmed
                )
                .stream()
                .map(BookMapper::toResponse)
                .toList();
    }
}

