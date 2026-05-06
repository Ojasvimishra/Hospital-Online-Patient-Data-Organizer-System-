import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Tabs,
  Tab,
  Avatar,
  Chip,
  useTheme,
  Alert,
  alpha,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material';
import {
  Logout,
  People,
  MedicalServices,
  CalendarToday,
  Assignment,
  Person,
  Business,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';

const HospitalDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ThemeContext);

  const [stats, setStats] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('hospitalDashboardTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem('hospitalDashboardTab', newValue);
  };
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, patientsRes, doctorsRes, pendingRes, appointmentsRes, recordsRes] = await Promise.all([
        axios.get('/api/hospital/dashboard'),
        axios.get('/api/patients/all'),
        axios.get('/api/doctors/hospital/all'),
        axios.get('/api/hospital/doctors/pending'),
        axios.get('/api/appointments/all'),
        axios.get('/api/medical-records/all')
      ]);
      setStats(statsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setPendingDoctors(pendingRes.data);
      setAppointments(appointmentsRes.data);
      setMedicalRecords(recordsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await axios.patch(`/api/hospital/doctors/${doctorId}/approve`);
      setPendingDoctors(pendingDoctors.filter(doc => doc._id !== doctorId));
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving doctor:', error);
      setError('Failed to approve doctor.');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await axios.patch(`/api/hospital/doctors/${doctorId}/reject`);
      setPendingDoctors(pendingDoctors.filter(doc => doc._id !== doctorId));
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      setError('Failed to reject doctor.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8, fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <AppBar position="sticky" elevation={0} sx={{ background: 'transparent', pt: 2, zIndex: 10 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ 
              gap: 2, 
              background: theme.palette.background.paper, 
              borderRadius: '24px', 
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'light' ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none',
              px: 3, py: 1
          }}>
            <Box sx={{ p: 1.5, bgcolor: '#4338ca', borderRadius: '14px', color: '#fff', display: 'flex' }}>
              <Business />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Hospital<Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>Admin</Box>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
              <Button
                color="inherit"
                onClick={() => navigate('/')}
                sx={{ borderRadius: '12px', px: 2, color: 'text.secondary', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/profile')}
                startIcon={<Person />}
                sx={{ borderRadius: '12px', px: 2, color: 'text.secondary', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
              >
                Profile
              </Button>
              <Button
                variant="contained"
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ 
                    borderRadius: '12px', px: 3, 
                    bgcolor: 'text.primary', color: 'background.paper',
                    fontWeight: 700,
                    boxShadow: theme.palette.mode === 'light' ? '0 4px 14px 0 rgba(15,23,42,0.2)' : 'none',
                    '&:hover': { bgcolor: 'text.secondary', transform: 'translateY(-2px)' } 
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 900, letterSpacing: '-0.02em', mb: 1 }}>
                Enterprise Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                System overview and full administrative control for {user?.name || 'Administrator'}.
            </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '16px', fontWeight: 600 }}>{error}</Alert>}

        {/* Stats Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <People sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.totalPatients || patients.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Total Patients</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MedicalServices sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.totalDoctors || doctors.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Active Doctors</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarToday sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.totalAppointments || appointments.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Appointments</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Assignment sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{stats.totalRecords || medicalRecords.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Medical Records</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Content Area */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '32px',
            bgcolor: '#ffffff',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #f1f5f9',
              px: 3,
              pt: 2,
              '& .MuiTabs-indicator': {
                  height: 3,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  bgcolor: '#4338ca'
              },
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                color: '#64748b',
                mr: 2,
                '&.Mui-selected': { color: '#4338ca' }
              }
            }}
          >
            <Tab label="Patients" icon={<People sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Doctors" icon={<MedicalServices sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Doctor Approvals" icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Appointments" icon={<CalendarToday sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Medical Records" icon={<Assignment sx={{ fontSize: 20 }} />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 1 }}>
              {/* Patients Tab */}
              {tabValue === 0 && (
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Patient Details</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date of Birth</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Gender</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Contact Info</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Blood Group</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow
                          key={patient._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #4338ca' }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(67,56,202,0.1)', color: '#4338ca', fontWeight: 800 }}>
                                {patient.firstName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={800} color="#0f172a">
                                  {patient.firstName} {patient.lastName}
                                </Typography>
                                <Typography variant="caption" color="#64748b" fontWeight={600}>
                                  ID: {patient._id?.substring(0, 8).toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                              <Typography variant="body2" color="#475569" fontWeight={600}>{new Date(patient.dateOfBirth).toLocaleDateString()}</Typography>
                          </TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>
                              <Typography variant="body2" color="#475569" fontWeight={600}>{patient.gender}</Typography>
                          </TableCell>
                          <TableCell>
                              <Typography variant="body2" color="#0f172a" fontWeight={600}>{patient.phone}</Typography>
                          </TableCell>
                          <TableCell>
                            {patient.bloodGroup ? (
                              <Chip label={patient.bloodGroup} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 800 }} />
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {patients.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <People sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No patients found</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Doctors Tab */}
              {tabValue === 1 && (
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Doctor Profile</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Specialization</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>License</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Contact Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow
                          key={doctor._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #0ea5e9' }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 800 }}>
                                {doctor.firstName?.[0]}
                              </Avatar>
                              <Typography variant="body1" fontWeight={800} color="#0f172a">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={doctor.specialization} size="small" sx={{ bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontWeight: 700 }} />
                          </TableCell>
                          <TableCell>
                              <Typography variant="body2" color="#475569" fontWeight={600}>{doctor.department}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f1f5f9', px: 1, py: 0.5, borderRadius: 1, fontWeight: 700, color: '#0f172a', display: 'inline-block' }}>
                              {doctor.licenseNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                              <Typography variant="body2" color="#0f172a" fontWeight={600}>{doctor.phone}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {doctors.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <MedicalServices sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No doctors found</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Doctor Approvals Tab */}
              {tabValue === 2 && (
                <Box sx={{ p: 2 }}>
                  {pendingDoctors.length === 0 ? (
                    <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.3 }}>
                      <Person sx={{ fontSize: 64, mb: 2 }} />
                      <Typography variant="h5" fontWeight={700}>No pending approvals</Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table sx={{ minWidth: 900 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Applicant Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Email Address</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Specialty & License</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Review Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pendingDoctors.map((doctor) => (
                            <TableRow
                              key={doctor._id}
                              sx={{
                                '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #f59e0b' }
                              }}
                            >
                              <TableCell>
                                <Typography variant="body1" fontWeight={800} color="#0f172a">
                                  {doctor.firstName} {doctor.lastName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                  <Typography variant="body2" color="#475569" fontWeight={600}>{doctor.userId?.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Box>
                                    <Chip label={doctor.specialization} size="small" sx={{ mb: 1, bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700 }} />
                                    <Typography variant="caption" display="block" color="#64748b" fontWeight={600} fontFamily="monospace">
                                        LIC: {doctor.licenseNumber}
                                    </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={2}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApproveDoctor(doctor._id)}
                                    sx={{ borderRadius: '12px', fontWeight: 700, px: 3, boxShadow: 'none' }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRejectDoctor(doctor._id)}
                                    sx={{ borderRadius: '12px', fontWeight: 700, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
                                  >
                                    Reject
                                  </Button>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}

              {/* Appointments Tab */}
              {tabValue === 3 && (
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Patient</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Doctor</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>System Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow
                          key={appointment._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #f59e0b' }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={700} color="#0f172a">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="#64748b" fontWeight={700}>
                              {appointment.appointmentTime}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={800} color="#0f172a">{appointment.patientId?.firstName} {appointment.patientId?.lastName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={800} color="#0f172a">Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'uppercase', px: 1, letterSpacing: '0.05em' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {appointments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <CalendarToday sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No appointments found</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Medical Records Tab */}
              {tabValue === 4 && (
                <Box>
                  <Alert severity="info" sx={{ m: 3, borderRadius: '16px', fontWeight: 600 }}>
                    Enterprise view: Complete medical records and reports for all patients across the hospital system.
                  </Alert>
                  <TableContainer>
                    <Table sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date Created</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Patient Information</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Attending Doctor</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Diagnosis</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medicalRecords.map((record) => (
                          <TableRow
                            key={record._id}
                            sx={{
                              '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                              transition: 'all 0.2s',
                              '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #4338ca' }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body1" fontWeight={700} color="#0f172a">
                                {new Date(record.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="#64748b" fontWeight={700}>
                                {new Date(record.createdAt).toLocaleTimeString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 800 }}>
                                  {record.patientId?.firstName?.[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight={800} color="#0f172a">
                                    {record.patientId?.firstName} {record.patientId?.lastName}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="#64748b" fontWeight={600}>
                                    ID: {record.patientId?._id?.slice(-8).toUpperCase() || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 800 }}>
                                  {record.doctorId?.firstName?.[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight={800} color="#0f172a">
                                    Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                                  </Typography>
                                  <Chip
                                    label={record.doctorId?.specialization || 'General'}
                                    size="small"
                                    sx={{ mt: 0.5, bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700 }}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="#0f172a" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                                {record.diagnosis || '-'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        {medicalRecords.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                              <Box sx={{ opacity: 0.3 }}>
                                <Assignment sx={{ fontSize: 64, mb: 2 }} />
                                <Typography variant="h5" fontWeight={700}>No medical records found</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HospitalDashboard;
