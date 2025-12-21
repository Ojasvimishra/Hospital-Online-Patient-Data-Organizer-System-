import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Box,
  Avatar,
  Typography,
  Button,
  Alert,
  MenuItem,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  CameraAlt,
  Logout,
  ArrowBack
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      let endpoint;
      if (user.role === 'hospital') {
        endpoint = '/api/hospital/profile';
      } else {
        endpoint = `/api/${user.role}s/me`;
      }
      const response = await axios.get(endpoint);
      setProfileData(response.data);
      setFormData(response.data);
      if (response.data.profilePicture) {
        setPreviewImage(response.data.profilePicture);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      let endpoint;
      if (user.role === 'hospital') {
        endpoint = '/api/hospital/profile';
      } else {
        endpoint = `/api/${user.role}s/me`;
      }
      
      const response = await axios.patch(endpoint, formData);
      setProfileData(response.data);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      // Update user context if needed
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setPreviewImage(profileData?.profilePicture || null);
    setIsEditing(false);
    setMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    if (profileData?.name) {
      return profileData.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton onClick={() => navigate(`/${user.role}`)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}>
            My Profile
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && (
          <Alert 
            severity={message.includes('Error') ? 'error' : 'success'} 
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* Profile Picture Section */}
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={previewImage}
                  sx={{
                    width: 150,
                    height: 150,
                    margin: '0 auto',
                    bgcolor: 'primary.main',
                    fontSize: '3.5rem',
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.light',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                >
                  {!previewImage && getInitials()}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      right: 'calc(50% - 75px)',
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraAlt />
                  </IconButton>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {profileData?.firstName && profileData?.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : profileData?.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        },
                      }}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Form Section */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3, fontWeight: 600 }}>
                Personal Details
              </Typography>
              <Grid container spacing={3}>
                {user.role === 'patient' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData?.firstName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData?.lastName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData?.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        value={formData?.gender || ''}
                        onChange={handleInputChange}
                        disabled={true}
                      />
                    </Grid>
                  </>
                )}

                {user.role === 'doctor' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData?.firstName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData?.lastName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        name="specialization"
                        value={formData?.specialization || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData?.department || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="License Number"
                        name="licenseNumber"
                        value={formData?.licenseNumber || ''}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Qualification"
                        name="qualification"
                        value={formData?.qualification || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Experience (years)"
                        name="experience"
                        type="number"
                        value={formData?.experience || 0}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Consultation Fee"
                        name="consultationFee"
                        type="number"
                        value={formData?.consultationFee || 0}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </>
                )}

                {user.role === 'hospital' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hospital Name"
                        name="name"
                        value={formData?.name || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Registration Number"
                        name="registrationNumber"
                        value={formData?.registrationNumber || ''}
                        disabled={true}
                      />
                    </Grid>
                  </>
                )}

                {/* Common Fields */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={user?.email || formData?.email || ''}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData?.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Grid>

                {/* Address Fields for Patient and Hospital */}
                {(user.role === 'patient' || user.role === 'hospital') && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Address
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Street"
                        name="address.street"
                        value={formData?.address?.street || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="address.city"
                        value={formData?.address?.city || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="address.state"
                        value={formData?.address?.state || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        name="address.zipCode"
                        value={formData?.address?.zipCode || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, zipCode: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </>
                )}

                {/* Patient Specific Fields */}
                {user.role === 'patient' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Blood Group"
                        name="bloodGroup"
                        value={formData?.bloodGroup || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Allergies (comma separated)"
                        name="allergies"
                        value={Array.isArray(formData?.allergies) ? formData.allergies.join(', ') : ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                        }))}
                        disabled={!isEditing}
                        placeholder="e.g., Peanuts, Penicillin"
                      />
                    </Grid>
                  </>
                )}

                {/* Hospital Specific Fields */}
                {user.role === 'hospital' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Departments (comma separated)"
                      name="departments"
                      value={Array.isArray(formData?.departments) ? formData.departments.join(', ') : ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        departments: e.target.value.split(',').map(d => d.trim()).filter(d => d)
                      }))}
                      disabled={!isEditing}
                      placeholder="e.g., Cardiology, Neurology, Pediatrics"
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
