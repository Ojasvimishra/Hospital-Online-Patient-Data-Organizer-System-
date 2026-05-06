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
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Stack,
  Tooltip
} from '@mui/material';
import {
  Logout,
  CalendarToday,
  MedicalServices,
  Person,
  CheckCircle,
  Schedule,
  AddBox,
  History,
  Healing,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';

const DoctorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ThemeContext);

  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Dialogs
  const [openAdvice, setOpenAdvice] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  // Data
  const [adviceData, setAdviceData] = useState({ advice: '', prescription: '' });
  const [reportData, setReportData] = useState({ patientId: '', diagnosis: '', treatment: '', notes: '' });
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);

  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('doctorDashboardTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem('doctorDashboardTab', newValue);
  };
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = () => {
      fetchAppointments();
      fetchMedicalRecords();
    };

    loadData();
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/doctor');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get('/api/medical-records/doctor');
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  // --- Actions ---

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.patch(`/api/appointments/${appointmentId}/status`, { status });
      setMessage('Status updated successfully!');
      fetchAppointments();
    } catch (error) {
      setMessage('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenAdvice = (appointment) => {
    setSelectedAppointment(appointment);
    setAdviceData({ advice: appointment.advice || '', prescription: appointment.prescription || '' });
    setOpenAdvice(true);
  };

  const handleSubmitAdvice = async () => {
    try {
      await axios.patch(`/api/appointments/${selectedAppointment._id}/advice`, adviceData);
      setMessage('Advice added successfully!');
      setOpenAdvice(false);
      fetchAppointments();
    } catch (error) {
      setMessage('Error submitting advice: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateReport = async () => {
    try {
      await axios.post('/api/medical-records', reportData);
      setMessage('Medical report created successfully!');
      setOpenReport(false);
      setReportData({ patientId: '', diagnosis: '', treatment: '', notes: '' });
      fetchMedicalRecords();
    } catch (error) {
      console.log(error);
      setMessage('Error creating report: ' + (error.response?.data?.message || error.message));
    }
  };

  const viewPatientHistory = async (patientId) => {
    const patientAppointments = appointments.filter(a => a.patientId?._id === patientId);
    const patientRecords = medicalRecords.filter(r => r.patientId?._id === patientId);

    setSelectedPatientHistory({
      appointments: patientAppointments,
      records: patientRecords
    });
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
            <Box sx={{ p: 1.5, bgcolor: 'secondary.main', borderRadius: '14px', color: '#fff', display: 'flex' }}>
              <Healing />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Clinical<Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>Portal</Box>
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
                    Welcome back, Dr. {user?.lastName || user?.firstName || 'Doctor'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Here is your clinical schedule and patient data overview.
                </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddBox />}
              onClick={() => setOpenReport(true)}
              sx={{
                background: '#10b981',
                color: '#fff',
                borderRadius: '16px',
                px: 4,
                py: 2,
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)',
                '&:hover': { background: '#059669', transform: 'translateY(-3px)' }
              }}
            >
              New Medical Report
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

        {/* Stats Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarToday sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{appointments.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Total Appointments</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Schedule sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{appointments.filter(a => a.status === 'pending').length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Pending Requests</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{appointments.filter(a => a.status === 'confirmed').length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Confirmed</Typography>
                    </Box>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: 'rgba(79,70,229,0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MedicalServices sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>{medicalRecords.length}</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Records Created</Typography>
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
            sx={{
              borderBottom: '1px solid #f1f5f9',
              px: 3,
              pt: 2,
              '& .MuiTabs-indicator': {
                  height: 3,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  bgcolor: '#10b981'
              },
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                color: '#64748b',
                mr: 2,
                '&.Mui-selected': { color: '#10b981' }
              }
            }}
          >
            <Tab label="Patient Appointments" icon={<CalendarToday sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Medical Reports" icon={<MedicalServices sx={{ fontSize: 20 }} />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 1 }}>
              {/* Appointments Tab */}
              {tabValue === 0 && (
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Patient Information</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Reason for Visit</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow
                          key={appointment._id}
                          sx={{
                            '& td': { borderBottom: '1px solid #f8fafc', py: 3 },
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', transform: 'scale(1.002)', boxShadow: 'inset 4px 0 0 #10b981' }
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={700} color="#0f172a">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </Typography>
                            <Chip 
                                icon={<Schedule sx={{ fontSize: 14 }} />} 
                                label={appointment.appointmentTime} 
                                size="small" 
                                sx={{ mt: 1, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600, borderRadius: '8px' }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  width: 48, height: 48,
                                  bgcolor: 'rgba(14,165,233,0.1)',
                                  color: '#0ea5e9',
                                  fontWeight: 800
                                }}
                              >
                                {appointment.patientId?.firstName?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={800} color="#0f172a">
                                  {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                                </Typography>
                                <Typography variant="caption" color="#64748b" sx={{ fontWeight: 600 }}>
                                  Contact: {appointment.patientId?.phone}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#475569" sx={{ maxWidth: 200, fontWeight: 500 }}>
                              {appointment.reason}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              sx={{ fontWeight: 800, borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                                disabled={appointment.status !== 'pending'}
                                sx={{ borderRadius: '10px', fontWeight: 700, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleOpenAdvice(appointment)}
                                disabled={appointment.status === 'pending'}
                                sx={{ borderRadius: '10px', fontWeight: 700, bgcolor: appointment.status === 'pending' ? 'action.disabledBackground' : '#0f172a', color: appointment.status === 'pending' ? 'action.disabled' : '#fff', boxShadow: 'none', '&:hover': { bgcolor: '#1e293b' } }}
                              >
                                Advise
                              </Button>
                              <Tooltip title="View Patient History">
                                  <IconButton
                                    size="small"
                                    onClick={() => viewPatientHistory(appointment.patientId?._id)}
                                    sx={{ color: '#4f46e5', bgcolor: 'rgba(79,70,229,0.1)', borderRadius: '10px' }}
                                  >
                                    <History />
                                  </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {appointments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
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
              {tabValue === 1 && (
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Patient</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Diagnosis</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #f8fafc', py: 3 }}>Treatment Plan</TableCell>
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
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 800 }}>
                                {record.patientId?.firstName?.[0]}
                              </Avatar>
                              <Typography variant="body1" fontWeight={800} color="#0f172a">
                                {record.patientId?.firstName} {record.patientId?.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#0f172a" fontWeight={600}>{record.diagnosis}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#475569" sx={{ maxWidth: 300, fontWeight: 500 }}>
                              {record.treatment || '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {medicalRecords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                            <Box sx={{ opacity: 0.3 }}>
                              <MedicalServices sx={{ fontSize: 64, mb: 2 }} />
                              <Typography variant="h5" fontWeight={700}>No medical records found</Typography>
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
      </Container>


      {/* Advice Dialog */}
      <Dialog 
        open={openAdvice} 
        onClose={() => setOpenAdvice(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', pb: 1 }}>Provide Medical Advice</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3, fontWeight: 500 }}>
             Document your findings and prescribe medication for the patient.
          </Typography>
          <TextField
            fullWidth
            label="Diagnosis & Advice"
            multiline
            rows={4}
            value={adviceData.advice}
            onChange={(e) => setAdviceData({ ...adviceData, advice: e.target.value })}
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label="Prescription"
            multiline
            rows={4}
            value={adviceData.prescription}
            onChange={(e) => setAdviceData({ ...adviceData, prescription: e.target.value })}
            margin="normal"
            helperText="Enter medications, dosage, and frequency"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenAdvice(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleSubmitAdvice} variant="contained" sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
              Submit Advice
          </Button>
        </DialogActions>
      </Dialog>


      {/* Create Report Dialog */}
      <Dialog 
        open={openReport} 
        onClose={() => setOpenReport(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', pb: 1 }}>Create Official Medical Report</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Patient"
            margin="normal"
            value={reportData.patientId}
            onChange={(e) => setReportData({ ...reportData, patientId: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            {/* Unique patients from appointments */}
            {[...new Map(appointments.map(item => [item.patientId?._id, item.patientId])).values()]
              .filter(p => p) // filter undefined
              .map(patient => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName} ({patient.phone})
                </MenuItem>
              ))}
          </TextField>
          <TextField
            fullWidth
            label="Diagnosis"
            value={reportData.diagnosis}
            onChange={(e) => setReportData({ ...reportData, diagnosis: e.target.value })}
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label="Treatment Plan"
            multiline
            rows={3}
            value={reportData.treatment}
            onChange={(e) => setReportData({ ...reportData, treatment: e.target.value })}
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label="Additional Notes (Internal)"
            multiline
            rows={2}
            value={reportData.notes}
            onChange={(e) => setReportData({ ...reportData, notes: e.target.value })}
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenReport(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleCreateReport} variant="contained" sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
              Create Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient History Dialog */}
      <Dialog 
        open={openHistory} 
        onClose={() => setOpenHistory(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a' }}>Patient Complete History</DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedPatientHistory && (
            <Box>
              <Typography variant="h6" fontWeight={800} color="#4f46e5" sx={{ mb: 2, textTransform: 'uppercase' }}>Past Appointments</Typography>
              {selectedPatientHistory.appointments.length > 0 ? (
                <List sx={{ bgcolor: '#f8fafc', borderRadius: '16px', p: 2 }}>
                  {selectedPatientHistory.appointments.map(apt => (
                    <React.Fragment key={apt._id}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <ListItemText
                          primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography fontWeight={800} color="#0f172a">{new Date(apt.appointmentDate).toLocaleDateString()}</Typography>
                                  <Chip label={apt.status} size="small" color={getStatusColor(apt.status)} sx={{ fontWeight: 700 }} />
                              </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="#475569" fontWeight={500} display="block">
                                Reason: {apt.reason}
                              </Typography>
                              {apt.advice && (
                                  <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(14,165,233,0.1)', borderRadius: '8px' }}>
                                      <Typography variant="body2" color="#0ea5e9" fontWeight={600}>Advice Given: {apt.advice}</Typography>
                                  </Box>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : <Typography color="#64748b" fontWeight={500} sx={{ mb: 3 }}>No past appointments logged.</Typography>}

              <Typography variant="h6" fontWeight={800} color="#10b981" sx={{ mt: 4, mb: 2, textTransform: 'uppercase' }}>Medical Records</Typography>
              {selectedPatientHistory.records.length > 0 ? (
                <List sx={{ bgcolor: '#f8fafc', borderRadius: '16px', p: 2 }}>
                  {selectedPatientHistory.records.map(rec => (
                    <React.Fragment key={rec._id}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <ListItemText
                          primary={
                              <Typography fontWeight={800} color="#0f172a" sx={{ mb: 0.5 }}>
                                  {new Date(rec.createdAt).toLocaleDateString()} - {rec.diagnosis}
                              </Typography>
                          }
                          secondary={
                              <Typography variant="body2" color="#475569" fontWeight={500}>
                                  Treatment: {rec.treatment}
                              </Typography>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : <Typography color="#64748b" fontWeight={500}>No formal medical records on file.</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenHistory(false)}
            variant="contained"
            sx={{ borderRadius: '12px', px: 4, fontWeight: 700, bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' } }}
          >
              Close History
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DoctorDashboard;
