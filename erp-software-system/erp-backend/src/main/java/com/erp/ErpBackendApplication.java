package com.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.erp.entity.User;
import com.erp.enums.Role;
import com.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ErpBackendApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(ErpBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Create default admin user if not exists
		if (userRepository.findByUsername("admin@erp.com").isEmpty()) {
			User adminUser = new User();
			adminUser.setUsername("admin@erp.com");
			adminUser.setEmail("admin@erp.com");
			adminUser.setPassword(passwordEncoder.encode("admin123"));
			adminUser.setRole(Role.ADMIN);
			userRepository.save(adminUser);
			System.out.println("Default admin user created: admin@erp.com / admin123");
		}

		// Create default test user
		if (userRepository.findByUsername("test@gmail.com").isEmpty()) {
			User testUser = new User();
			testUser.setUsername("test@gmail.com");
			testUser.setEmail("test@gmail.com");
			testUser.setPassword(passwordEncoder.encode("test123"));
			testUser.setRole(Role.SALES_EXECUTIVE);
			userRepository.save(testUser);
			System.out.println("Default test user created: test@gmail.com / test123");
		}
	}
}