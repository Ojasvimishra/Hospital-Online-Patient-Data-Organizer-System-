🏥 Hospital Online Patient Data Management System

A secure, scalable, and role-based Hospital Online Patient Data Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This system digitizes hospital operations by efficiently managing patients, doctors, appointments, and medical records with strict access control and modern web technologies.

📌 Project Overview

The Hospital Online Patient Data Management System is designed to replace traditional paper-based hospital workflows with a centralized digital platform.
It provides three-tier role-based access — Patient, Doctor, and Hospital/Admin — each with specialized permissions and responsibilities.

The system focuses on:

Data accuracy

Security & privacy

Scalability

Ease of use

Real-world hospital workflow simulation

🎯 Key Objectives

Digitize patient health records securely

Simplify doctor–patient interaction

Enable hospitals to manage large datasets efficiently

Implement role-based access control (RBAC)

Provide RESTful APIs for future scalability (mobile apps, integrations)

🧩 System Roles & Functionalities
👤 Patient Module

Secure patient registration and login

Book appointments with available doctors

View appointment history and status

Access medical records and prescriptions

Read doctor advice and treatment plans

👨‍⚕️ Doctor Module

Secure doctor registration and authentication

View assigned patient appointments

Accept, reschedule, or cancel appointments

Create and maintain medical records

Provide medical advice and prescriptions

Track patient treatment history

🏢 Hospital / Admin Module

Centralized dashboard with system statistics

Access all patients, doctors, and appointments

Monitor complete medical records

Perform data-level supervision and management

High-level system control and analytics

⚙️ Technology Stack
🔹 Backend

Node.js – Runtime environment

Express.js – REST API framework

JWT (JSON Web Token) – Secure authentication

bcrypt – Password encryption

MongoDB – NoSQL database

Mongoose – ODM for database modeling

🔹 Frontend

React.js – Component-based UI

Material-UI (MUI) – Modern UI components

Context API – State management

Axios / Fetch API – API communication

🔹 Database

MongoDB Atlas / Local MongoDB

Schema-based document storage

Indexed queries for performance optimization

🗂️ Project Structure
Hospital-Online-Patient-Data-Management-System/
│
├── backend/
│   ├── models/              # MongoDB Schemas
│   ├── routes/              # API Routes
│   ├── controllers/         # Business Logic
│   ├── middleware/          # Auth & Role Guard
│   ├── config/              # DB & Environment Config
│   ├── server.js            # Server Entry Point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable Components
│   │   ├── pages/           # Page-Level Components
│   │   ├── context/         # Global State Providers
│   │   ├── services/        # API Services
│   │   └── App.js
│   └── package.json
│
└── README.md

🚀 Installation & Setup
📋 Prerequisites

Node.js (v14+)

MongoDB (Local or Atlas)

npm or yarn

🔧 Backend Setup
cd backend
npm install


Create .env file:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_online_management
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development


Run backend server:

npm start
# OR (development mode)
npm run dev


📍 Backend runs on: http://localhost:5000

🎨 Frontend Setup
cd frontend
npm install
npm start


📍 Frontend runs on: http://localhost:3000

🔌 API Endpoints (RESTful)
🔐 Authentication

POST /api/auth/register/patient

POST /api/auth/register/doctor

POST /api/auth/register/hospital

POST /api/auth/login

GET /api/auth/me

📅 Appointments

POST /api/appointments (Patient)

GET /api/appointments/patient

GET /api/appointments/doctor

GET /api/appointments/all (Hospital)

PATCH /api/appointments/:id/status

PATCH /api/appointments/:id/advice

📄 Medical Records

POST /api/medical-records (Doctor)

GET /api/medical-records/patient

GET /api/medical-records/doctor

GET /api/medical-records/all (Hospital)

🧑‍⚕️ Patients & Doctors

GET /api/patients/me

GET /api/patients/all

GET /api/doctors/me

GET /api/doctors/all

🏥 Hospital Admin

GET /api/hospital/profile

GET /api/hospital/dashboard

GET /api/hospital/all-data

🔐 Security Implementation

Password hashing using bcrypt

JWT-based stateless authentication

Role-Based Access Control (RBAC)

Protected routes via middleware

Environment variable security

CORS configuration for deployment

📈 Future Enhancements

Role-based dashboards with charts (Chart.js)

Email & SMS notifications

File upload for reports (PDF, scans)

AI-based health analytics

Mobile application support

Audit logs and activity tracking

🛠️ Development Commands

Backend:

npm run dev


Frontend:

npm start

📄 License

This project is open-source and intended for educational and learning purposes.
You are free to modify and extend the system for academic or portfolio projects.

👨‍💻 Author

Ojasvi Mishra
B.Tech CSE | MERN Stack Developer | AI & ML Enthusiast
