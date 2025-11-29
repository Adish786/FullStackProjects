package com.erp.service;


import com.erp.dto.UpdateUserRequest;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.erp.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Thread-safe user lookup by username
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * ✅ Thread-safe and transactional update
     */
    @Transactional
    public synchronized User updateUser(Long id, UpdateUserRequest request) {

        User user = userRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Prevent race condition on username change
        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * ✅ Thread-safe role update
     */
    @Transactional
    public synchronized User updateUserRole(Long id, String role) {
        User user = userRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.valueOf(role));
        return userRepository.save(user);
    }

    /**
     * ✅ Thread-safe delete with self-delete prevention
     */
    @Transactional
    public synchronized void deleteUser(Long id) {

        User user = userRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentUser = getCurrentUsername();

        if (user.getUsername().equals(currentUser)) {
            throw new RuntimeException("Cannot delete your own account");
        }

        userRepository.delete(user);
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
