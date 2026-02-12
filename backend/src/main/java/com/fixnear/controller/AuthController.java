package com.fixnear.controller;

import com.fixnear.dto.*;
import com.fixnear.model.User;
import com.fixnear.repository.UserRepository;
import com.fixnear.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository repo,
                          PasswordEncoder encoder,
                          JwtUtil jwtUtil) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {

        if (req.getEmail() == null || req.getEmail().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("Email is required", null));
        }

        if (req.getPassword() == null || req.getPassword().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("Password is required", null));
        }

        if (repo.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("Email already exists", null));
        }

        try {
            User user = new User();
            user.setName(req.getName());
            user.setEmail(req.getEmail());
            user.setPassword(encoder.encode(req.getPassword()));
            user.setRoles(List.of("USER"));
            user = repo.save(user);

            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(
                    new AuthResponse("Signup successful", token, user.getId(), user.getName(), user.getEmail())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("Signup failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("Email and password are required", null));
        }

        try {
            User user = repo.findByEmail(req.getEmail())
                    .orElse(null);

            if (user == null || !encoder.matches(req.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new AuthResponse("Invalid email or password", null));
            }

            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(
                    new AuthResponse("Login successful", token, user.getId(), user.getName(), user.getEmail())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse("Login failed: " + e.getMessage(), null));
        }
    }
}
