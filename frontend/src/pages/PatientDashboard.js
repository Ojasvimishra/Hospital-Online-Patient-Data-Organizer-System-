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
  useTheme
} from '@mui/material';
import {
  LocalHospital,
  Logout,
  CalendarToday,
  MedicalServices,
  Person,
  CheckCircle,
  Cancel,
  Schedule,
  Add,
  History,
  Info
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import StatsCard from '../components/common/StatsCard';
import PageHeader from '../components/common/PageHeader';

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Dialogs
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For viewing advice

  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchMedicalRecords();
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
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <LocalHospital sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}>
            Health Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              startIcon={<Person />}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<Logout />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <PageHeader
          title={`Hello, ${user?.firstName || 'User'}`}
          subtitle="Manage your health journey"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAppointment(true)}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
              }}
            >
              Book Appointment
            </Button>
          }
        />

        {message && (
          <Alert
            severity={message.includes('Error') ? 'error' : 'success'}
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Upcoming Visits"
              value={activeAppointments.length}
              icon={CalendarToday}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Past Visits"
              value={pastAppointments.length}
              icon={History}
              color={theme.palette.text.secondary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Medical Records"
              value={medicalRecords.length}
              icon={MedicalServices}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <Tab label="Upcoming Appointments" icon={<Schedule />} iconPosition="start" />
            <Tab label="Past History" icon={<History />} iconPosition="start" />
            <Tab label="Medical Reports" icon={<MedicalServices />} iconPosition="start" />
          </Tabs>

          {/* Upcoming Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeAppointments.map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{new Date(appointment.appointmentDate).toLocaleDateString()}</Typography>
                          <Typography variant="caption" color="text.secondary">{appointment.appointmentTime}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{appointment.doctorId?.firstName?.[0]}</Avatar>
                            <Box>
                              <Typography variant="body2">Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</Typography>
                              <Typography variant="caption" color="text.secondary">{appointment.doctorId?.specialization}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Chip label={appointment.status} color={getStatusColor(appointment.status)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                    {activeAppointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          No upcoming appointments
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Past History Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 0 }}>
              <Alert severity="info" sx={{ m: 2 }}>
                This section contains your completed appointments and doctor's advice.
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastAppointments.map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Chip label={appointment.status} color={getStatusColor(appointment.status)} size="small" />
                        </TableCell>
                        <TableCell>
                          {appointment.advice ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleViewAdvice(appointment)}
                              startIcon={<CheckCircle />}
                            >
                              View Advice
                            </Button>
                          ) : <Typography variant="caption">n/a</Typography>}
                        </TableCell>
                      </TableRow>
                    ))}
                    {pastAppointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No past history available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Medical Records Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 0 }}>
              <Alert severity="info" sx={{ m: 2 }}>
                Official medical reports, diagnoses, and lab results created by your doctors.
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Diagnosis</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Treatment</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalRecords.map((record) => (
                      <TableRow key={record._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {new Date(record.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(record.createdAt).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {record.doctorId?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={record.doctorId?.specialization || 'N/A'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {record.diagnosis || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {record.treatment || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedAppointment(record);
                              setOpenHistory(true);
                            }}
                            startIcon={<Info />}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {medicalRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <MedicalServices sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No medical reports found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Your medical reports will appear here once your doctor creates them.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>

        {/* Book Appointment Dialog */}
        <Dialog open={openAppointment} onClose={() => setOpenAppointment(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              margin="normal"
              value={appointmentData.doctorId}
              onChange={(e) => setAppointmentData({ ...appointmentData, doctorId: e.target.value })}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Date"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={appointmentData.appointmentDate}
              onChange={(e) => setAppointmentData({ ...appointmentData, appointmentDate: e.target.value })}
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={appointmentData.appointmentTime}
              onChange={(e) => setAppointmentData({ ...appointmentData, appointmentTime: e.target.value })}
            />
            <TextField
              fullWidth
              label="Reason for Visit"
              margin="normal"
              multiline
              rows={3}
              value={appointmentData.reason}
              onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAppointment(false)}>Cancel</Button>
            <Button onClick={handleBookAppointment} variant="contained">Book Now</Button>
          </DialogActions>
        </Dialog>

        {/* View Advice/Medical Record Dialog */}
        <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedAppointment?.advice ? 'Doctor\'s Advice & Prescription' : 'Medical Report Details'}
          </DialogTitle>
          <DialogContent dividers>
            {selectedAppointment && (
              <Box>
                {selectedAppointment.advice ? (
                  // Appointment Advice View
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Diagnosis/Advice</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                      <Typography>{selectedAppointment.advice}</Typography>
                    </Paper>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Prescription</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography style={{ whiteSpace: 'pre-line' }}>
                        {selectedAppointment.prescription || 'No prescription provided.'}
                      </Typography>
                    </Paper>
                  </>
                ) : (
                  // Medical Record View
                  <>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {new Date(selectedAppointment.createdAt).toLocaleDateString()} at {new Date(selectedAppointment.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Doctor</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          Dr. {selectedAppointment.doctorId?.firstName} {selectedAppointment.doctorId?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedAppointment.doctorId?.specialization}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Diagnosis</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                      <Typography>{selectedAppointment.diagnosis || 'No diagnosis provided.'}</Typography>
                    </Paper>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Treatment</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                      <Typography style={{ whiteSpace: 'pre-line' }}>
                        {selectedAppointment.treatment || 'No treatment details provided.'}
                      </Typography>
                    </Paper>

                    {selectedAppointment.notes && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Additional Notes</Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography style={{ whiteSpace: 'pre-line' }}>{selectedAppointment.notes}</Typography>
                        </Paper>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHistory(false)}>Close</Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default PatientDashboard;
