package com.example.demo.auth.controller;

import com.example.demo.auth.dto.AuthRequest;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.dto.LogoutRequest;
import com.example.demo.auth.dto.RefreshRequest;
import com.example.demo.auth.entity.Role;
import com.example.demo.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final String bookKeeperInviteCode;

    public AuthController(AuthService authService, @Value("${app.security.bookkeeper-invite-code:change-me}") String bookKeeperInviteCode) {
        this.authService = authService;
        this.bookKeeperInviteCode = bookKeeperInviteCode;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerStudent(@Valid @RequestBody AuthRequest request) {
        authService.register(request, Role.STUDENT);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register-bookkeeper")
    public ResponseEntity<Void> registerBookKeeper(
            @RequestHeader(name = "X-Invite-Code", required = false) String inviteCode,
            @Valid @RequestBody AuthRequest request
    ) {
        if (inviteCode == null || !inviteCode.equals(bookKeeperInviteCode)) {
            return ResponseEntity.status(403).build();
        }
        authService.register(request, Role.BOOK_KEEPER);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request.getRefreshToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}

