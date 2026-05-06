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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Stack,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import {
  LocalHospital,
  Logout,
  CalendarToday,
  MedicalServices,
  Person,
  CheckCircle,
  Schedule,
  Add,
  History,
  Info,
  AccessTime,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import StatsCard from '../components/common/StatsCard';

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ThemeContext);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Dialogs
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('patientDashboardTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem('patientDashboardTab', newValue);
  };

  useEffect(() => {
    const loadData = () => {
      fetchAppointments();
      fetchDoctors();
      fetchMedicalRecords();
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/patient');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors/all');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get('/api/medical-records/patient');
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      await axios.post('/api/appointments', appointmentData);
      setMessage('Appointment booked successfully!');
      setOpenAppointment(false);
      setAppointmentData({ doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' });
      fetchAppointments();
    } catch (error) {
      setMessage('Error booking appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  const activeAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  const handleViewAdvice = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenHistory(true);
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

  // Helper to format doctor availability
  const formatAvailability = (availability) => {
    if (!availability) return 'Schedule not provided';
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availableDays = days.filter(d => availability[d]?.available);
    if (availableDays.length === 0) return 'Currently unavailable';
    
    // Pick the first available day as an example, or just show general hours
    const firstDay = availableDays[0];
    return `Available from ${availability[firstDay].start} to ${availability[firstDay].end} (e.g. ${firstDay.charAt(0).toUpperCase() + firstDay.slice(1)})`;
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
            <Box sx={{ p: 1.5, bgcolor: 'primary.main', borderRadius: '14px', color: '#fff', display: 'flex' }}>
              <LocalHospital />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Patient<Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>Portal</Box>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 900, letterSpacing: '-0.02em', mb: 1 }}>
                    Hello, {user?.firstName || 'Patient'}!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Your health dashboard and medical records are up to date.
                </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAppointment(true)}
              sx={{
                background: '#0ea5e9',
                color: '#fff',
                borderRadius: '16px',
                px: 4,
                py: 2,
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 10px 25px -5px rgba(14,165,233,0.4)',
                '&:hover': { background: '#0284c7', transform: 'translateY(-3px)' }
              }}
            >
              Book New Appointment
            </Button>
        </Box>

        {message && (
          <Alert
            severity={message.includes('Error') ? 'error' : 'success'}
            sx={{ mb: 4, borderRadius: '16px', fontWeight: 600 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Schedule sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{activeAppointments.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Upcoming Visits</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MedicalServices sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{medicalRecords.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Medical Reports</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <History sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{pastAppointments.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Past Consultations</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
        </Grid>

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
                  bgcolor: '#4f46e5'
              },
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                color: '#64748b',
                mr: 2,
                '&.Mui-selected': { color: '#4f46e5' }
              }
            }}
          >
            <Tab label="Upcoming Visits" icon={<Schedule sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Medical Reports" icon={<MedicalServices sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Doctors Directory" icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Past History" icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 1 }}>
              {/* Upcoming Tab */}
              {tabValue === 0 && (
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Specialist</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Reason</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeAppointments.map((appointment) => (
                        <TableRow
                          key={appointment._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #0ea5e9' }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={700} color="#0f172a">
                              {new Date(appointment.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Typography>
                            <Chip 
                                icon={<Schedule sx={{ fontSize: 14 }} />} 
                                label={appointment.appointmentTime} 
                                size="small" 
                                sx={{ mt: 1, bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 600, borderRadius: '8px' }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontWeight: 800 }}>
                                {appointment.doctorId?.firstName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={800} color="#0f172a">
                                  Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                                </Typography>
                                <Typography variant="caption" color="#64748b" sx={{ fontWeight: 600 }}>
                                  {appointment.doctorId?.specialization}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#475569" sx={{ maxWidth: 250, fontWeight: 500 }}>
                              {appointment.reason}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', px: 1 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {activeAppointments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <CalendarToday sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No upcoming visits</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Medical Records Tab */}
              {tabValue === 1 && (
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Specialist</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Diagnosis</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicalRecords.map((record) => (
                        <TableRow
                          key={record._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #4f46e5' }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={700} color="#0f172a">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="#64748b" fontWeight={600}>
                              {new Date(record.createdAt).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 800 }}>
                                {record.doctorId?.firstName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={800} color="#0f172a">
                                  Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                                </Typography>
                                <Typography variant="caption" color="#64748b" sx={{ fontWeight: 600 }}>
                                  {record.doctorId?.specialization}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#0f172a" sx={{ maxWidth: 250, fontWeight: 600 }}>
                              {record.diagnosis || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              onClick={() => { setSelectedAppointment(record); setOpenHistory(true); }}
                              startIcon={<Info />}
                              sx={{ borderRadius: '12px', fontWeight: 700, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
                            >
                              View Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {medicalRecords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <MedicalServices sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No medical reports found</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Doctors Directory Tab - NEW FEATURE */}
              {tabValue === 2 && (
                <Box sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '0 0 32px 32px' }}>
                  <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 4 }}>
                      Hospital Specialists & Availability
                  </Typography>
                  <Grid container spacing={3}>
                      {doctors.map(doctor => (
                          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
                              <Card sx={{ 
                                  borderRadius: '20px', 
                                  border: '1px solid #e2e8f0',
                                  bgcolor: '#fff',
                                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                  transition: 'all 0.3s',
                                  '&:hover': { boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', transform: 'translateY(-4px)', borderColor: '#0ea5e9' }
                              }}>
                                  <CardContent sx={{ p: 3 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                          <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 800, fontSize: '1.5rem' }}>
                                              {doctor.firstName?.[0]}
                                          </Avatar>
                                          <Box>
                                              <Typography variant="h6" fontWeight={800} color="#0f172a">
                                                  Dr. {doctor.firstName} {doctor.lastName}
                                              </Typography>
                                              <Chip label={doctor.specialization} size="small" sx={{ mt: 0.5, bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700 }} />
                                          </Box>
                                      </Box>
                                      <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />
                                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
                                          <Box sx={{ p: 1, bgcolor: 'rgba(16,185,129,0.1)', borderRadius: '10px' }}>
                                              <AccessTime sx={{ color: '#10b981', fontSize: 20 }} />
                                          </Box>
                                          <Box>
                                              <Typography variant="caption" color="#64748b" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free Time / Availability</Typography>
                                              <Typography variant="body2" color="#334155" fontWeight={600} sx={{ mt: 0.5 }}>
                                                  {formatAvailability(doctor.availability)}
                                              </Typography>
                                          </Box>
                                      </Box>
                                      <Button 
                                          fullWidth 
                                          variant="outlined" 
                                          onClick={() => {
                                              setAppointmentData(prev => ({ ...prev, doctorId: doctor._id }));
                                              setOpenAppointment(true);
                                              setTabValue(0); // Optional: switch back to first tab to show the dialog over relevant content
                                          }}
                                          sx={{ 
                                              borderRadius: '12px', 
                                              borderWidth: '2px', 
                                              color: '#0ea5e9', 
                                              borderColor: '#0ea5e9',
                                              fontWeight: 800, 
                                              py: 1.2,
                                              '&:hover': { bgcolor: '#0ea5e9', color: '#fff', borderWidth: '2px', boxShadow: '0 8px 16px -4px rgba(14,165,233,0.4)' } 
                                          }}
                                      >
                                          Book Appointment
                                      </Button>
                                  </CardContent>
                              </Card>
                          </Grid>
                      ))}
                      {doctors.length === 0 && (
                          <Grid item xs={12}>
                              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                  No specialists currently available.
                              </Typography>
                          </Grid>
                      )}
                  </Grid>
                </Box>
              )}

              {/* Past History Tab */}
              {tabValue === 3 && (
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Specialist</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Advice</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastAppointments.map((appointment) => (
                        <TableRow
                          key={appointment._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)' }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={700} color="#0f172a">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight={800} color="#0f172a">
                              Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                            />
                          </TableCell>
                          <TableCell>
                            {appointment.advice ? (
                              <Button
                                variant="contained"
                                color="info"
                                onClick={() => handleViewAdvice(appointment)}
                                startIcon={<CheckCircle />}
                                sx={{ borderRadius: '12px', fontWeight: 700, boxShadow: 'none' }}
                              >
                                View Advice
                              </Button>
                            ) : <Typography variant="body2" color="#94a3b8" fontWeight={600}>No advice logged</Typography>}
                          </TableCell>
                        </TableRow>
                      ))}
                      {pastAppointments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <History sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No past history available</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
          </Box>
        </Paper>

        {/* Book Appointment Dialog */}
        <Dialog 
            open={openAppointment} 
            onClose={() => setOpenAppointment(false)} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', pb: 1 }}>Request Appointment</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="#64748b" sx={{ mb: 3, fontWeight: 500 }}>
                Fill out the details below. Our team will verify the doctor's schedule and confirm.
            </Typography>
            <TextField
              select
              fullWidth
              label="Select Specialist"
              margin="normal"
              value={appointmentData.doctorId}
              onChange={(e) => setAppointmentData({ ...appointmentData, doctorId: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TextField
                fullWidth
                label="Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={appointmentData.appointmentDate}
                onChange={(e) => setAppointmentData({ ...appointmentData, appointmentDate: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <TextField
                fullWidth
                label="Time"
                type="time"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={appointmentData.appointmentTime}
                onChange={(e) => setAppointmentData({ ...appointmentData, appointmentTime: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
            </Box>
            <TextField
              fullWidth
              label="Reason for Visit"
              margin="normal"
              multiline
              rows={4}
              value={appointmentData.reason}
              onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpenAppointment(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
            <Button 
                onClick={handleBookAppointment} 
                variant="contained"
                sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700, bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            >
                Confirm Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Advice/Medical Record Dialog */}
        <Dialog 
            open={openHistory} 
            onClose={() => setOpenHistory(false)} 
            maxWidth="md" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a' }}>
            {selectedAppointment?.advice ? 'Doctor\'s Advice & Prescription' : 'Official Medical Report'}
          </DialogTitle>
          <DialogContent>
            {selectedAppointment && (
              <Box sx={{ mt: 2 }}>
                {selectedAppointment.advice ? (
                  <>
                    <Box sx={{ bgcolor: 'rgba(14,165,233,0.05)', p: 3, borderRadius: '16px', mb: 3, border: '1px solid rgba(14,165,233,0.1)' }}>
                        <Typography variant="subtitle2" color="#0ea5e9" fontWeight={800} sx={{ mb: 1, textTransform: 'uppercase' }}>Diagnosis / Advice</Typography>
                        <Typography variant="body1" color="#0f172a" fontWeight={500}>{selectedAppointment.advice}</Typography>
                    </Box>

                    <Box sx={{ bgcolor: 'rgba(16,185,129,0.05)', p: 3, borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)' }}>
                        <Typography variant="subtitle2" color="#10b981" fontWeight={800} sx={{ mb: 1, textTransform: 'uppercase' }}>Prescription</Typography>
                        <Typography variant="body1" color="#0f172a" fontWeight={500} style={{ whiteSpace: 'pre-line' }}>
                            {selectedAppointment.prescription || 'No prescription provided.'}
                        </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', gap: 4, mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: '16px' }}>
                      <Box>
                        <Typography variant="subtitle2" color="#64748b" fontWeight={700} textTransform="uppercase">Record Date</Typography>
                        <Typography variant="body1" fontWeight={800} color="#0f172a">
                          {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="#64748b" fontWeight={700} textTransform="uppercase">Specialist</Typography>
                        <Typography variant="body1" fontWeight={800} color="#0f172a">
                          Dr. {selectedAppointment.doctorId?.firstName} {selectedAppointment.doctorId?.lastName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="#4f46e5" fontWeight={800} sx={{ mb: 1, textTransform: 'uppercase' }}>Diagnosis</Typography>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f1f5f9', borderRadius: '16px' }}>
                            <Typography fontWeight={600} color="#0f172a">{selectedAppointment.diagnosis || 'No diagnosis provided.'}</Typography>
                        </Paper>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="#0ea5e9" fontWeight={800} sx={{ mb: 1, textTransform: 'uppercase' }}>Treatment Plan</Typography>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f1f5f9', borderRadius: '16px' }}>
                            <Typography fontWeight={500} color="#0f172a" style={{ whiteSpace: 'pre-line' }}>
                                {selectedAppointment.treatment || 'No treatment details provided.'}
                            </Typography>
                        </Paper>
                    </Box>

                    {selectedAppointment.notes && (
                      <Box>
                        <Typography variant="subtitle2" color="#f59e0b" fontWeight={800} sx={{ mb: 1, textTransform: 'uppercase' }}>Additional Notes</Typography>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#fef3c7', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <Typography fontWeight={500} color="#92400e" style={{ whiteSpace: 'pre-line' }}>{selectedAppointment.notes}</Typography>
                        </Paper>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
                onClick={() => setOpenHistory(false)}
                variant="contained"
                sx={{ borderRadius: '12px', px: 4, fontWeight: 700, bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' } }}
            >
                Close Report
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default PatientDashboard;
