🎓 College Management System
College Management System
Comprehensive system for managing college operations, students, and academic activities.

🚀 Features
Student Management - Admissions and student records

Course Management - Curriculum and course scheduling

Faculty Management - Staff and teacher administration

Attendance System - Student attendance tracking

Grade Management - Marks and results processing

Fee Management - Fee collection and receipts

🛠️ Tech Stack
Backend
Spring Boot 6

JDK 21

Spring Security

Hibernate JPA

PostgreSQL

Spring Batch (for reports)

Frontend
React 18

Vite

TypeScript

Bootstrap 5

React Router

⚙️ Installation
Backend
bash
cd college-management-system/backend

# Create database
createdb college_management

# Run with profile
./mvnw spring-boot:run -Dspring.profiles.active=dev
Frontend
bash
cd ../frontend
npm install
npm run dev
🗄️ Initial Data
The system comes with sample data:

Departments

Courses

Sample users (Admin, Faculty, Students)

🔐 Default Login
Admin: admin@college.edu / admin123

Faculty: faculty@college.edu / faculty123

Student: student@college.edu / student123
