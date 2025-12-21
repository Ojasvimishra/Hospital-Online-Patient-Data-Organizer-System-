const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const { auth } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_super_secret_jwt_key', {
    expiresIn: '7d'
  });
};

// Register Patient
router.post('/register/patient', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Please select a valid gender'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg || `${err.param}: ${err.msg}`).join(', ');
      return res.status(400).json({ 
        message: `Validation failed: ${errorMessages}`,
        errors: errors.array() 
      });
    }

    const { email, password, firstName, lastName, dateOfBirth, gender, phone, address, emergencyContact, bloodGroup, allergies } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please use a different email or login.' });
    }

    // Create patient profile
    const patient = new Patient({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      address,
      emergencyContact,
      bloodGroup,
      allergies: allergies || []
    });

    await patient.save();

    // Create user account
    const user = new User({
      email,
      password,
      role: 'patient',
      profileId: patient._id,
      roleModel: 'Patient'
    });

    await user.save();

    // Update patient with userId
    patient.userId = user._id;
    await patient.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: patient
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({ message: 'An account with this email already exists. Please use a different email or login.' });
      }
      return res.status(400).json({ message: `A record with this ${field} already exists.` });
    }
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${validationErrors}` });
    }
    
    // Generic error
    res.status(500).json({ 
      message: 'Registration failed. Please check all required fields and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Register Doctor
router.post('/register/doctor', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg || `${err.param}: ${err.msg}`).join(', ');
      return res.status(400).json({ 
        message: `Validation failed: ${errorMessages}`,
        errors: errors.array() 
      });
    }

    const { email, password, firstName, lastName, specialization, qualification, licenseNumber, phone, department, experience, consultationFee, availability } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please use a different email or login.' });
    }

    // Check if license number already exists
    const existingDoctor = await Doctor.findOne({ licenseNumber });
    if (existingDoctor) {
      return res.status(400).json({ message: 'A doctor with this license number already exists. Please check your license number.' });
    }

    const doctor = new Doctor({
      firstName,
      lastName,
      specialization,
      qualification: qualification || 'Not specified',
      licenseNumber,
      phone,
      email,
      department,
      experience: experience || 0,
      consultationFee: consultationFee || 0,
      availability: availability || {}
    });

    await doctor.save();

    const user = new User({
      email,
      password,
      role: 'doctor',
      profileId: doctor._id,
      roleModel: 'Doctor'
    });

    await user.save();

    doctor.userId = user._id;
    await doctor.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: doctor
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'licenseNumber') {
        return res.status(400).json({ message: 'A doctor with this license number already exists. Please check your license number.' });
      }
      if (field === 'email') {
        return res.status(400).json({ message: 'An account with this email already exists. Please use a different email or login.' });
      }
      return res.status(400).json({ message: `A record with this ${field} already exists.` });
    }
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${validationErrors}` });
    }
    
    // Generic error
    res.status(500).json({ 
      message: 'Registration failed. Please check all required fields and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Register Hospital
router.post('/register/hospital', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().trim().withMessage('Hospital name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('registrationNumber').notEmpty().withMessage('Registration number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg || `${err.param}: ${err.msg}`).join(', ');
      return res.status(400).json({ 
        message: `Validation failed: ${errorMessages}`,
        errors: errors.array() 
      });
    }

    const { email, password, name, address, phone, registrationNumber, departments } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please use a different email or login.' });
    }

    // Check if registration number already exists
    const existingHospital = await Hospital.findOne({ registrationNumber });
    if (existingHospital) {
      return res.status(400).json({ message: 'A hospital with this registration number already exists. Please check your registration number.' });
    }

    const hospital = new Hospital({
      name,
      address,
      phone,
      email,
      registrationNumber,
      departments: departments || []
    });

    await hospital.save();

    const user = new User({
      email,
      password,
      role: 'hospital',
      profileId: hospital._id,
      roleModel: 'Hospital'
    });

    await user.save();

    hospital.userId = user._id;
    await hospital.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: hospital
      }
    });
  } catch (error) {
    console.error('Hospital registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'registrationNumber') {
        return res.status(400).json({ message: 'A hospital with this registration number already exists. Please check your registration number.' });
      }
      if (field === 'email') {
        return res.status(400).json({ message: 'An account with this email already exists. Please use a different email or login.' });
      }
      return res.status(400).json({ message: `A record with this ${field} already exists.` });
    }
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${validationErrors}` });
    }
    
    // Generic error
    res.status(500).json({ 
      message: 'Registration failed. Please check all required fields and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('profileId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if doctor is approved
    if (user.role === 'doctor' && user.profileId.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is pending approval from the hospital.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profileId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('profileId');
    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profileId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

