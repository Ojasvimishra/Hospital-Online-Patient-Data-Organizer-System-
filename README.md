# Hospital Online Patient Data Organizer System (HOPDS) 🏥

![HOPDS Banner](https://img.shields.io/badge/Status-Active-brightgreen) ![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-orange)

HOPDS is a comprehensive, full-stack **MERN (MongoDB, Express, React, Node.js)** platform designed to digitize and streamline hospital management. It acts as a centralized ecosystem connecting Patients, Doctors, and Hospital Administrators through dedicated portals to manage appointments, medical records, and personnel approvals efficiently.

## 🚀 Live Demo
**[Vercel Deployment URL]** *(Insert your Vercel URL here once deployed)*

---

## ✨ Key Features & Portals

### 1. Patient Portal 🧑‍⚕️
*   **Secure Authentication**: Register and login securely.
*   **Appointment Booking**: Select available doctors, specify symptoms, and request appointments.
*   **Medical History**: View comprehensive digital medical records and past doctor advice.
*   **Profile Management**: Update personal and contact details seamlessly.

### 2. Doctor Portal 👨‍⚕️
*   **Appointment Management**: View, approve, or reject incoming patient appointment requests.
*   **Patient Advisory**: Provide medical advice and prescriptions directly to approved appointments.
*   **Medical Records**: Create and push new medical reports to a patient's permanent history.
*   **Status Tracking**: Track "pending", "approved", and "completed" consultations.

### 3. Hospital Admin Portal 🏥
*   **Personnel Management**: Oversee all registered patients and doctors.
*   **Doctor Verification**: Approve or reject newly registered doctors before they can access the platform.
*   **System Overview**: Global view of all appointments, records, and hospital statistics.

### 4. Global Platform Features 🌐
*   **Dynamic Theming**: Premium Light/Dark mode architecture that persists across sessions.
*   **Responsive UI**: Built with Material UI (MUI) v5 for a seamless mobile, tablet, and desktop experience.
*   **Secure Routing**: JWT-based protected routes ensuring data privacy.

---

## 🛠️ Technology Stack

**Frontend:**
*   React.js (v18)
*   Material UI (MUI v5)
*   React Router DOM (v6)
*   Axios (API communication)
*   Context API (State Management)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose
*   JSON Web Tokens (JWT) & bcryptjs (Authentication)
*   Cors & dotenv

---

## ⚙️ Installation & Local Development

### Prerequisites
*   Node.js (v16+)
*   MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/Ojasvimishra/Hospital-patient-data-organisation-system.git
cd Hospital-patient-data-organisation-system
```

### 2. Install Dependencies
This project uses a monorepo setup. Install root dependencies, which will automatically install frontend and backend dependencies via postinstall script:
```bash
npm install
```
*(Alternatively, run `npm install` inside both `/frontend` and `/backend` directories)*

### 3. Environment Variables
Create a `project.env` file in the **backend** directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_management
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Run the Application
Start both the backend server and the React frontend concurrently:
```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm start
```
The application will be available at `http://localhost:3000`.

---

## 🌍 Vercel Deployment

This project is perfectly pre-configured for Serverless deployment on Vercel using the root `vercel.json` file.

1.  Connect your GitHub repository to Vercel.
2.  Vercel will automatically read the `vercel.json` to route `/api/*` to `@vercel/node` and the frontend to `@vercel/static-build`.
3.  Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`) in the Vercel Dashboard.
4.  Deploy!

---

## 👨‍💻 Developer Information

**Ojasvi Mishra**  
*Full Stack Developer*

*   📧 Email: ojasvimishra9792@gmail.com
*   📱 Mobile: +91-9044256927
*   💼 LinkedIn: [ojasvi-mishra2004](http://www.linkedin.com/in/ojasvi-mishra2004)
*   🐙 GitHub: [Ojasvimishra](https://github.com/Ojasvimishra)

---

## 📝 License
This project is licensed under the MIT License.
