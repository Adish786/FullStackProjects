
💼 Intern Management System
Intern Management System
A comprehensive platform for managing internship programs built with Spring Boot 6 and React Vite.

🚀 Features
Intern Onboarding - Streamlined registration process

Project Management - Assign and track intern projects

Progress Tracking - Monitor intern performance

Mentor Assignment - Assign mentors to interns

Document Management - Store intern documents securely

Evaluation System - Performance reviews and feedback

🛠️ Tech Stack
Backend
Spring Boot 6

JDK 21

Spring Security with JWT

Spring Data JPA

PostgreSQL

Maven

Frontend
React 18

Vite

TypeScript

Material-UI

React Query

📋 Prerequisites
JDK 21

Node.js 18+

PostgreSQL 14+

Maven 3.6+

⚙️ Installation & Setup
Backend Setup
Clone and setup

bash
git clone https://github.com/your-username/intern-management-system.git
cd intern-management-system/backend
Database configuration

sql
CREATE DATABASE intern_management;
CREATE USER intern_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE intern_management TO intern_user;
Environment configuration

properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/intern_management
spring.datasource.username=intern_user
spring.datasource.password=password
Run backend

bash
./mvnw spring-boot:run
Frontend Setup
Setup frontend

bash
cd ../frontend
npm install
Environment setup

env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Intern Management System
Start development

bash
npm run dev
🗄️ Database Schema
Key tables:

interns - Intern information

mentors - Mentor details

projects - Intern projects

evaluations - Performance evaluations

attendance - Attendance records

🔐 Authentication
JWT-based authentication with roles:

SUPER_ADMIN

ADMIN

MENTOR

INTERN

🧪 Testing
bash
# Backend tests
./mvnw test

# Frontend tests
npm run test
