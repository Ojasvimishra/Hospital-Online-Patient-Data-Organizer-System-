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
  Alert
} from '@mui/material';
import {
  Logout,
  People,
  MedicalServices,
  CalendarToday,
  Assignment,
  Person
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import StatsCard from '../components/common/StatsCard';
import PageHeader from '../components/common/PageHeader';

const HospitalDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [stats, setStats] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
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
      default: return 'default';
    }
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await axios.patch(`/api/hospital/doctors/${doctorId}/approve`);
      setPendingDoctors(pendingDoctors.filter(doc => doc._id !== doctorId));
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving doctor:', error);
      setError('Failed to approve doctor.');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await axios.patch(`/api/hospital/doctors/${doctorId}/reject`);
      setPendingDoctors(pendingDoctors.filter(doc => doc._id !== doctorId));
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      setError('Failed to reject doctor.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          {/* <Business sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} /> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}>
            Hospital Administration
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
          title={`Welcome, ${user?.name || 'Admin'}`}
          subtitle="Hospital Overview & Management"
        />

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Patients"
              value={stats.totalPatients || patients.length}
              icon={People}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Doctors"
              value={stats.totalDoctors || doctors.length}
              icon={MedicalServices}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Appointments"
              value={stats.totalAppointments || appointments.length}
              icon={CalendarToday}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Medical Records"
              value={stats.totalRecords || medicalRecords.length}
              icon={Assignment}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <Tab label="Patients" icon={<People />} iconPosition="start" />
            <Tab label="Doctors" icon={<MedicalServices />} iconPosition="start" />
            <Tab label="Doctor Approvals" icon={<Person />} iconPosition="start" />
            <Tab label="Appointments" icon={<CalendarToday />} iconPosition="start" />
            <Tab label="Medical Records" icon={<Assignment />} iconPosition="start" />
          </Tabs>

          {/* Patients Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Blood Group</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{patient.firstName} {patient.lastName}</Typography>
                        </TableCell>
                        <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.bloodGroup || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {patients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>No patients found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Doctors Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>License</TableCell>
                      <TableCell>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow key={doctor._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>Dr. {doctor.firstName} {doctor.lastName}</Typography>
                        </TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>{doctor.department}</TableCell>
                        <TableCell>{doctor.licenseNumber}</TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                      </TableRow>
                    ))}
                    {doctors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>No doctors found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Doctor Approvals Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Pending Doctor Approvals</Typography>
              {pendingDoctors.length === 0 ? (
                <Typography>No pending doctor approvals.</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Specialization</TableCell>
                        <TableCell>License Number</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingDoctors.map((doctor) => (
                        <TableRow key={doctor._id}>
                          <TableCell>{doctor.firstName} {doctor.lastName}</TableCell>
                          <TableCell>{doctor.userId?.email}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.licenseNumber}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApproveDoctor(doctor._id)}
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleRejectDoctor(doctor._id)}
                            >
                              Reject
                            </Button>
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
            <Box sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{new Date(appointment.appointmentDate).toLocaleDateString()}</Typography>
                          <Typography variant="caption" color="text.secondary">{appointment.appointmentTime}</Typography>
                        </TableCell>
                        <TableCell>{appointment.patientId?.firstName} {appointment.patientId?.lastName}</TableCell>
                        <TableCell>Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</TableCell>
                        <TableCell>
                          <Chip label={appointment.status} color={getStatusColor(appointment.status)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>No appointments found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Medical Records Tab */}
          {tabValue === 4 && (
            <Box sx={{ p: 0 }}>
              <Alert severity="info" sx={{ m: 2 }}>
                Complete medical records and reports for all patients in the hospital system.
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Diagnosis</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Treatment</TableCell>
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
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                              {record.patientId?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {record.patientId?.firstName} {record.patientId?.lastName}
                              </Typography>
                              {record.patientId?.phone && (
                                <Typography variant="caption" color="text.secondary">
                                  {record.patientId.phone}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {record.doctorId?.firstName?.[0]}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                            </Typography>
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
                          <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                            {record.diagnosis || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                            {record.treatment || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {medicalRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            No medical records found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Medical records will appear here once doctors create them.
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
      </Container>
    </Box>
  );
};

export default HospitalDashboard;
