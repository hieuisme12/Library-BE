package com.example.demo.auth.service;

import com.example.demo.auth.dto.AuthRequest;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.entity.Role;

public interface AuthService {
    void register(AuthRequest request, Role role);

    AuthResponse login(AuthRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);
}

