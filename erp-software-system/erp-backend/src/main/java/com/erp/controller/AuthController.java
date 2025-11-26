package com.erp.controller;


import com.erp.dto.LoginRequest;
import com.erp.dto.RegisterRequest;
import com.erp.entity.User;
import com.erp.enums.Role;
import com.erp.security.JwtUtil;
import com.erp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getUsername());

            // Check if user exists first
            Optional<User> userOptional = userService.getUserByUsername(loginRequest.getUsername());
            if (userOptional.isEmpty()) {
                System.out.println("User not found: " + loginRequest.getUsername());
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOptional.get();
            System.out.println("Stored password hash: " + user.getPassword());
            System.out.println("Input password: " + loginRequest.getPassword());

            // Manually check password for debugging
            boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            System.out.println("Password matches: " + passwordMatches);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", ((User) userDetails).getRole().name());

            System.out.println("Login successful for user: " + loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed for user: " + loginRequest.getUsername() + " - " + e.getMessage());
            e.printStackTrace(); // Add stack trace for more details
            return ResponseEntity.badRequest().body("Invalid credentials: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Registration attempt for: " + registerRequest.getUsername());

            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setEmail(registerRequest.getEmail());
            user.setRole(Role.valueOf(registerRequest.getRole()));

            userService.saveUser(user);

            System.out.println("Registration successful for: " + registerRequest.getUsername());
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            System.out.println("Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}
