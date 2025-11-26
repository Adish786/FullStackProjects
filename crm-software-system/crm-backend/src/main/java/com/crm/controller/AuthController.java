package com.crm.controller;


import com.crm.dto.LoginRequest;
import com.crm.dto.LoginResponse;
import com.crm.dto.RegisterRequest;
import com.crm.enums.Role;
import com.crm.model.User;
import com.crm.security.JwtUtil;
import com.crm.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getPassword(),
                Role.valueOf(request.getRole().toUpperCase())
        );

        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }
/*
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByEmail(request.getEmail()).orElseThrow();
            String jwt = jwtUtil.generateToken(request.getEmail());

            return ResponseEntity.ok(new LoginResponse(jwt, user.getEmail(), user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

 */
@PostMapping("/login")
public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest authRequest) {
    try {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(401).body("Invalid email or password");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Authentication failed");
    }

    // Load user details and generate token
    final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
    final String jwt = jwtUtil.generateToken(userDetails);

    // Get user role
    User user = userService.findByEmail(authRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(new LoginResponse(jwt, user.getEmail(), user.getRole().toString()));
}
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(user);
    }
}