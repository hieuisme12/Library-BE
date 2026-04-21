package com.example.demo.books.repository;

import com.example.demo.books.entity.Book;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String titleKeyword,
            String authorKeyword,
            String categoryKeyword
    );
}

