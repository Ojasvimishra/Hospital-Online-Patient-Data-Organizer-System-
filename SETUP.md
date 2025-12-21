# Setup Guide

## Quick Start

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system.
- Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Or use MongoDB Atlas (cloud) and update the connection string in `.env`

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start the backend:
```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## First Steps

1. **Register a Hospital Account**
   - Go to Register page
   - Select "Hospital" as role
   - Fill in hospital details
   - This will be your admin account

2. **Register Doctor Accounts**
   - Register doctors with their specialization and license numbers
   - Doctors can then log in and manage appointments

3. **Register Patient Accounts**
   - Patients can register and book appointments
   - They can view their medical records

## Testing the System

1. Create test accounts for each role
2. As a patient, book an appointment with a doctor
3. As a doctor, confirm the appointment and provide advice
4. As a hospital, view all records and statistics

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` (or start MongoDB service on Windows)
- Check the connection string in `.env`
- For MongoDB Atlas, use the connection string provided

### Port Already in Use
- Change the PORT in backend `.env` file
- Update the proxy in `frontend/package.json` if needed

### CORS Errors
- Make sure backend is running on port 5000
- Check that frontend proxy is set correctly in `package.json`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in request headers

