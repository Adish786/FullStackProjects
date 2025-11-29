📚 Bookstore Management System Bookstore Management System A fullstack application for managing bookstore operations built with Spring Boot 6, JDK 21, and React Vite.

🚀 Features Inventory Management - Track books, authors, and categories

Sales Processing - Handle customer purchases and transactions

Supplier Management - Manage book suppliers and orders

Reporting - Generate sales and inventory reports

User Management - Role-based access control

🛠️ Tech Stack Backend Spring Boot 6

JDK 21

Spring Security

JPA/Hibernate

MySQL/PostgreSQL

Maven

Frontend React 18

Vite

TypeScript

Tailwind CSS

Axios

📋 Prerequisites JDK 21

Node.js 18+

MySQL 8+ or PostgreSQL 14+

Maven 3.6+

⚙️ Installation & Setup Backend Setup Clone the repository

bash git clone https://github.com/your-username/bookstore-management-system.git cd bookstore-management-system/backend Configure database

bash

Create database
mysql -u root -p CREATE DATABASE bookstore_db; Update application properties

properties

src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db spring.datasource.username=your_username spring.datasource.password=your_password Run the application

bash ./mvnw spring-boot:run Backend will start on http://localhost:8080

Frontend Setup Navigate to frontend directory

bash cd ../frontend Install dependencies

bash npm install Configure environment variables

bash cp .env.example .env Edit .env:

env VITE_API_BASE_URL=http://localhost:8080/api Start development server

bash npm run dev Frontend will start on http://localhost:5173

🗄️ Database Initialization The application will automatically create tables on first run. Sample data can be loaded using:

bash ./mvnw spring-boot:run -Dspring.profiles.active=seed 🔧 API Endpoints Method Endpoint Description GET /api/books Get all books POST /api/books Create new book GET /api/books/{id} Get book by ID PUT /api/books/{id} Update book DELETE /api/books/{id} Delete book 👥 Default Users Admin: admin@bookstore.com / admin123

Manager: manager@bookstore.com / manager123

Staff: staff@bookstore.com / staff123