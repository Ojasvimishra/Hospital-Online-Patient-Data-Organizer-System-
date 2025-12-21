# Hospital Management System

A comprehensive hospital management system built with Node.js, React.js, and MongoDB. This system provides three-tier access: Patient, Doctor, and Hospital, each with specific functionalities.

## Features

### Patient Features
- User registration and login
- Book appointments with doctors
- View appointment history
- View medical records
- Access doctor advice and prescriptions

### Doctor Features
- User registration and login
- View patient appointments
- Confirm/cancel appointments
- Provide medical advice to patients
- Add prescriptions
- Create and manage medical records

### Hospital Features
- Access to all patient records
- Access to all doctor information
- View all appointments
- View all medical records
- Dashboard with statistics
- Complete data management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Material-UI
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
Project/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Register a new patient
- `POST /api/auth/register/doctor` - Register a new doctor
- `POST /api/auth/register/hospital` - Register a new hospital
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Appointments
- `POST /api/appointments` - Book appointment (Patient)
- `GET /api/appointments/patient` - Get patient appointments
- `GET /api/appointments/doctor` - Get doctor appointments
- `GET /api/appointments/all` - Get all appointments (Hospital)
- `PATCH /api/appointments/:id/status` - Update appointment status (Doctor)
- `PATCH /api/appointments/:id/advice` - Add advice/prescription (Doctor)

### Medical Records
- `POST /api/medical-records` - Create medical record (Doctor)
- `GET /api/medical-records/patient` - Get patient records
- `GET /api/medical-records/doctor` - Get doctor records
- `GET /api/medical-records/all` - Get all records (Hospital)

### Patients
- `GET /api/patients/me` - Get patient profile
- `GET /api/patients/all` - Get all patients (Hospital)
- `GET /api/patients/:id` - Get single patient

### Doctors
- `GET /api/doctors/me` - Get doctor profile
- `GET /api/doctors/all` - Get all doctors
- `GET /api/doctors/hospital/all` - Get all doctors (Hospital)

### Hospital
- `GET /api/hospital/profile` - Get hospital profile
- `GET /api/hospital/dashboard` - Get dashboard statistics
- `GET /api/hospital/all-data` - Get all data

## Usage

1. **Register**: Create an account as Patient, Doctor, or Hospital
2. **Login**: Use your credentials to access the system
3. **Patient**: Book appointments and view your medical records
4. **Doctor**: Manage appointments and provide medical advice
5. **Hospital**: Access and manage all system data

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Protected API routes

## Development

To run in development mode with auto-reload:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## Notes

- Make sure MongoDB is running before starting the backend
- Update the JWT_SECRET in production
- Configure CORS settings if deploying to different domains
- Use environment variables for sensitive data

## License

This project is open source and available for educational purposes.


