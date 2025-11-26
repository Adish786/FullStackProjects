
🏭 ERP Software System
ERP Software System
Enterprise Resource Planning system integrating various business functions.

🚀 Modules
Human Resources - Employee management

Inventory - Stock and warehouse management

Accounting - Financial transactions and reporting

Sales - Order processing and invoicing

Procurement - Purchase order management

Manufacturing - Production planning

🛠️ Tech Stack
Backend
Spring Boot 6

JDK 21

Spring Security

Spring Data JPA

MySQL Cluster

Redis (Caching)

Spring Batch

Frontend
React 18

Vite

TypeScript

Redux Toolkit

Material-UI

WebSocket

⚙️ Setup Instructions
Backend Setup
bash
cd erp-software-system/backend

# Database setup
mysql -u root -p < database/init.sql

# Run application
./mvnw spring-boot:run
Frontend Setup
bash
cd ../frontend
npm install
npm run build
npm run preview
🔧 Configuration Files
Database Configuration
sql
-- Create ERP database
CREATE DATABASE erp_system;
Application Properties
properties
spring.datasource.url=jdbc:mysql://localhost:3306/erp_system
spring.redis.host=localhost
spring.cache.type=redis
🚀 Deployment
Docker Deployment
bash
docker-compose up -d
Production Build
bash
# Backend
./mvnw clean package -DskipTests

# Frontend
npm run build
