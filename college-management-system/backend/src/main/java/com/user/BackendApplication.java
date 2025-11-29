package com.user;

import com.user.entity.User;
import com.user.enums.Role;
import com.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// ✅ DataInitializer moved into main class
	@Bean
	CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {

			// Admin user
			if (!userRepository.existsByEmail("admin@college.edu")) {
				User admin = new User();
				admin.setFullName("Super Admin");
				admin.setEmail("admin@college.edu");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole(Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Created default ADMIN user: admin@example.com / admin123");
			}

			// Teacher user
			if (!userRepository.existsByEmail("teacher@college.edu")) {
				User teacher = new User();
				teacher.setFullName("Default Teacher");
				teacher.setEmail("teacher@college.edu");
				teacher.setPassword(passwordEncoder.encode("teacher123"));
				teacher.setRole(Role.TEACHER);
				userRepository.save(teacher);
				System.out.println("Created default TEACHER user: teacher@example.com / teacher123");
			}
		};
	}
}
