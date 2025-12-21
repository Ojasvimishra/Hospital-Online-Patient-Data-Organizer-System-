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
  RateReview,
  AddBox,
  History
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import StatsCard from '../components/common/StatsCard';
import PageHeader from '../components/common/PageHeader';

const DoctorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

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

  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchMedicalRecords();
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
    // In a real app, you might fetch specific history here. 
    // For now, we filter existing loaded data for simplicity, 
    // but ideally we should hit an endpoint like /api/patients/:id/history
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
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <MedicalServices sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}>
            Doctor Portal Hello! Doctor
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
          title={`Welcome Dr. ${user?.firstName || 'Doctor'}`}
          subtitle="Manage your schedule and patients"
          action={
            <Button
              variant="contained"
              startIcon={<AddBox />}
              onClick={() => setOpenReport(true)}
            >
              Create New Report
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

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Appointments"
              value={appointments.length}
              icon={CalendarToday}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Pending"
              value={appointments.filter(a => a.status === 'pending').length}
              icon={Schedule}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Confirmed Today"
              value={appointments.filter(a => a.status === 'confirmed').length}
              icon={CheckCircle}
              color={theme.palette.success.main}
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

        {/* Tabs */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <Tab label="Appointments" icon={<CalendarToday />} iconPosition="start" />
            <Tab label="Medical Records" icon={<MedicalServices />} iconPosition="start" />
          </Tabs>

          {/* Appointments Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.appointmentTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{appointment.patientId?.firstName?.[0]}</Avatar>
                            <Box>
                              <Typography variant="body2">{appointment.patientId?.firstName} {appointment.patientId?.lastName}</Typography>
                              <Typography variant="caption" color="text.secondary">{appointment.patientId?.phone}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Chip label={appointment.status} color={getStatusColor(appointment.status)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                              disabled={appointment.status !== 'pending'}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenAdvice(appointment)}
                            >
                              Advise
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => viewPatientHistory(appointment.patientId?._id)}
                            >
                              History
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No appointments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Medical Records Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Diagnosis</TableCell>
                      <TableCell>Treatment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalRecords.map((record) => (
                      <TableRow key={record._id} hover>
                        <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{record.patientId?.firstName} {record.patientId?.lastName}</TableCell>
                        <TableCell>{record.diagnosis}</TableCell>
                        <TableCell>{record.treatment || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {medicalRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          No medical records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>


      {/* Advice Dialog */}
      <Dialog open={openAdvice} onClose={() => setOpenAdvice(false)} maxWidth="md" fullWidth>
        <DialogTitle>Medical Advice & Prescription</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Advice"
            multiline
            rows={4}
            value={adviceData.advice}
            onChange={(e) => setAdviceData({ ...adviceData, advice: e.target.value })}
            margin="normal"
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdvice(false)}>Cancel</Button>
          <Button onClick={handleSubmitAdvice} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>


      {/* Create Report Dialog */}
      <Dialog open={openReport} onClose={() => setOpenReport(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Medical Report</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            fullWidth
            label="Select Patient"
            margin="normal"
            value={reportData.patientId}
            onChange={(e) => setReportData({ ...reportData, patientId: e.target.value })}
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
          />
          <TextField
            fullWidth
            label="Treatment Plan"
            multiline
            rows={3}
            value={reportData.treatment}
            onChange={(e) => setReportData({ ...reportData, treatment: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={2}
            value={reportData.notes}
            onChange={(e) => setReportData({ ...reportData, notes: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReport(false)}>Cancel</Button>
          <Button onClick={handleCreateReport} variant="contained">Create Report</Button>
        </DialogActions>
      </Dialog>

      {/* Patient History Dialog */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Patient History</DialogTitle>
        <DialogContent dividers>
          {selectedPatientHistory && (
            <Box>
              <Typography variant="h6" gutterBottom>Past Appointments</Typography>
              {selectedPatientHistory.appointments.length > 0 ? (
                <List>
                  {selectedPatientHistory.appointments.map(apt => (
                    <React.Fragment key={apt._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`${new Date(apt.appointmentDate).toLocaleDateString()} - ${apt.status}`}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                Reason: {apt.reason}
                              </Typography>
                              {apt.advice && <br />}
                              {apt.advice && `Advice: ${apt.advice}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : <Typography color="text.secondary">No past appointments.</Typography>}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Medical Records</Typography>
              {selectedPatientHistory.records.length > 0 ? (
                <List>
                  {selectedPatientHistory.records.map(rec => (
                    <React.Fragment key={rec._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`${new Date(rec.createdAt).toLocaleDateString()} - ${rec.diagnosis}`}
                          secondary={rec.treatment}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : <Typography color="text.secondary">No medical records.</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DoctorDashboard;
