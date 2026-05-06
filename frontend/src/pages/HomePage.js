import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Avatar,
  AvatarGroup,
  Stack,
  useTheme,
  IconButton,
  Divider
} from '@mui/material';
import {
  LocalHospital,
  ArrowForward,
  CalendarToday,
  AutoGraph,
  LightMode,
  DarkMode,
  Security,
  Speed,
  Devices,
  CheckCircleOutline,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  GitHub,
  Email,
  Phone
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ThemeContext);

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Bank-Grade Security',
      description: 'Your medical records are encrypted end-to-end. We adhere to the highest healthcare data compliance standards.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Instant Booking',
      description: 'Skip the waiting room. See doctor availability in real-time and book appointments instantly from your dashboard.'
    },
    {
      icon: <Devices sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Universal Access',
      description: 'Access your patient portal from any device—desktop, tablet, or smartphone. Your health data, anywhere you go.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Create an Account',
      description: 'Sign up in seconds. Choose whether you are a patient, doctor, or hospital administrator.'
    },
    {
      step: '02',
      title: 'Complete Profile',
      description: 'Add your medical history or professional credentials to unlock the full power of the HOPDS portal.'
    },
    {
      step: '03',
      title: 'Manage Health',
      description: 'Book appointments, view prescriptions, or manage your clinic schedule seamlessly.'
    }
  ];

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.default',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* Hero Section Container */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ 
            background: theme.palette.background.paper,
            borderRadius: { xs: '32px', md: '48px' },
            boxShadow: theme.palette.mode === 'light' 
                ? '0 25px 50px -12px rgba(37,99,235,0.1)' 
                : '0 25px 50px -12px rgba(0,0,0,0.5)',
            minHeight: 'calc(100vh - 64px)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          {/* Navigation Bar inside Hero Container */}
          <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: 'primary.main', borderRadius: '16px', color: '#fff', display: 'flex' }}>
                <LocalHospital sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>
                HOPDS<Box component="span" sx={{ color: 'primary.main' }}> Portal</Box>
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
              <Button 
                  onClick={() => navigate('/login')}
                  sx={{ 
                      color: 'text.primary', 
                      fontWeight: 700, 
                      borderRadius: '9999px',
                      px: 3,
                      '&:hover': { bgcolor: 'action.hover' }
                  }}
              >
                Log In
              </Button>
              <Button 
                  variant="contained" 
                  onClick={() => navigate('/register')}
                  sx={{ 
                      bgcolor: 'text.primary', 
                      color: 'background.paper', 
                      borderRadius: '9999px',
                      px: 4, py: 1.5,
                      fontWeight: 700,
                      boxShadow: theme.palette.mode === 'light' ? '0 10px 25px -5px rgba(15,23,42,0.3)' : '0 10px 25px -5px rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'text.secondary', color: 'background.paper' }
                  }}
              >
                Get Started
              </Button>
            </Stack>
          </Box>

          {/* Main Content Area */}
          <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pb: 10 }}>
            <Grid container spacing={8} alignItems="center">
              
              {/* Left Column: Text & Call to Action */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Chip 
                    icon={<AutoGraph sx={{ color: 'primary.main' }} />}
                    label="Hospital Online Patient Data System" 
                    sx={{ 
                        bgcolor: theme.palette.mode === 'light' ? '#eff6ff' : 'rgba(37, 99, 235, 0.1)', 
                        color: 'primary.main', 
                        fontWeight: 800, 
                        borderRadius: '9999px',
                        px: 1, py: 2.5,
                        mb: 4,
                        border: `1px solid ${theme.palette.mode === 'light' ? '#bfdbfe' : 'rgba(37, 99, 235, 0.2)'}`
                    }} 
                  />
                  <Typography 
                    variant="h1" 
                    sx={{ 
                        color: 'text.primary', 
                        mb: 3
                    }}
                  >
                    Streamline Your<br />
                    <Box component="span" sx={{ color: 'primary.main' }}>Healthcare.</Box>
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'text.secondary', 
                        fontWeight: 500, 
                        lineHeight: 1.6, 
                        mb: 6,
                        maxWidth: '85%'
                    }}
                  >
                    Manage appointments, securely access medical records, and connect with top specialists through our advanced hospital portal.
                  </Typography>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 8 }}>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/login')}
                        endIcon={<ArrowForward />}
                        sx={{ 
                            bgcolor: 'primary.main', 
                            color: '#fff', 
                            borderRadius: '9999px',
                            px: 5, py: 2,
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            boxShadow: theme.palette.mode === 'light' ? '0 20px 40px -10px rgba(37,99,235,0.5)' : 'none',
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-4px)' }
                        }}
                    >
                      Enter Portal
                    </Button>
                  </Stack>

                  {/* Trust Badges */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                          <CheckCircleOutline sx={{ color: '#10b981' }} />
                          <CheckCircleOutline sx={{ color: '#10b981' }} />
                          <CheckCircleOutline sx={{ color: '#10b981' }} />
                      </Box>
                      <Box>
                          <Typography variant="body1" fontWeight={800} color="text.primary">Secure. Fast. Reliable.</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>Built for modern healthcare.</Typography>
                      </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column: Dynamic Visuals & Floating Glass UI */}
              <Grid item xs={12} md={6} sx={{ position: 'relative', height: '600px' }}>
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                      {/* Main Background Area */}
                      <Box 
                        sx={{
                            position: 'absolute',
                            right: '5%',
                            top: '10%',
                            width: '80%',
                            height: '80%',
                            borderRadius: '48px',
                            background: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80) center/cover',
                            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)',
                            overflow: 'hidden'
                        }}
                      >
                          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.4), transparent)' }} />
                      </Box>

                      {/* Floating Card 1 */}
                      <Box 
                          sx={{
                              position: 'absolute',
                              left: '0%',
                              top: '25%',
                              p: 3,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                              minWidth: 320,
                              bgcolor: 'background.paper',
                              borderRadius: '24px',
                              boxShadow: theme.palette.mode === 'light' ? '0 25px 50px -12px rgba(15,23,42,0.15)' : '0 25px 50px -12px rgba(0,0,0,0.5)',
                              border: `1px solid ${theme.palette.divider}`
                          }}
                      >
                          <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? '#ecfdf5' : 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: '#10b981' }}>
                              <CalendarToday sx={{ fontSize: 32 }} />
                          </Box>
                          <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">Live Status</Typography>
                              <Typography variant="h6" color="text.primary" fontWeight={800}>Dr. Smith is Available</Typography>
                              <Typography variant="body2" color="#10b981" fontWeight={700}>Waiting time: 2 mins</Typography>
                          </Box>
                      </Box>

                      {/* Floating Card 2 */}
                      <Box 
                          sx={{
                              position: 'absolute',
                              right: '-5%',
                              bottom: '15%',
                              p: 3,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                              minWidth: 280,
                              bgcolor: 'background.paper',
                              borderRadius: '24px',
                              boxShadow: theme.palette.mode === 'light' ? '0 25px 50px -12px rgba(15,23,42,0.15)' : '0 25px 50px -12px rgba(0,0,0,0.5)',
                              border: `1px solid ${theme.palette.divider}`
                          }}
                      >
                          <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? '#eff6ff' : 'rgba(37, 99, 235, 0.1)', borderRadius: '16px', color: 'primary.main' }}>
                              <LocalHospital sx={{ fontSize: 32 }} />
                          </Box>
                          <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">Secure Records</Typography>
                              <Typography variant="h6" color="text.primary" fontWeight={800}>Data Protected</Typography>
                              <Typography variant="body2" color="primary.main" fontWeight={700}>End-to-end encryption</Typography>
                          </Box>
                      </Box>
                  </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 10, md: 15 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
            Why Choose HOPDS?
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', fontWeight: 500 }}>
            We've built a platform that bridges the gap between patients, doctors, and hospital administrators, prioritizing speed, security, and usability.
          </Typography>
        </Box>
        
        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box 
                sx={{ 
                  p: 5, 
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: '32px',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.palette.mode === 'light' ? '0 25px 50px -12px rgba(0,0,0,0.05)' : '0 25px 50px -12px rgba(0,0,0,0.5)',
                  }
                }}
              >
                <Box sx={{ 
                  width: 80, height: 80, 
                  borderRadius: '24px', 
                  bgcolor: theme.palette.mode === 'light' ? '#eff6ff' : 'rgba(37, 99, 235, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 4
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>{feature.title}</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it Works Section */}
      <Box sx={{ bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : '#0f172a', py: { xs: 10, md: 15 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h2" sx={{ color: 'text.primary', mb: 3 }}>
                How It Works
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, fontWeight: 500, lineHeight: 1.6 }}>
                Our intuitive platform is designed to get you from registration to appointment booking in less than 5 minutes.
              </Typography>
              <Button 
                  variant="contained" 
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForward />}
                  sx={{ 
                      bgcolor: 'text.primary', 
                      color: 'background.paper', 
                      borderRadius: '9999px',
                      px: 5, py: 2,
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      '&:hover': { bgcolor: 'text.secondary', transform: 'translateY(-2px)' }
                  }}
              >
                Create Account
              </Button>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                {steps.map((step, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      gap: 4, 
                      p: 4, 
                      bgcolor: theme.palette.background.paper,
                      borderRadius: '24px',
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: 'primary.main', 
                        opacity: 0.5, 
                        fontWeight: 900,
                        lineHeight: 1
                      }}
                    >
                      {step.step}
                    </Typography>
                    <Box>
                      <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>{step.title}</Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}`, pt: 10, pb: 6 }}>
        <Container maxWidth="xl">
          <Grid container spacing={8} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: '12px', color: '#fff', display: 'flex' }}>
                  <LocalHospital sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>
                  HOPDS
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: '300px' }}>
                Revolutionizing healthcare management by connecting patients, doctors, and hospitals through a unified digital platform.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Facebook /></IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Twitter /></IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><LinkedIn /></IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Instagram /></IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>Platform</Typography>
              <Stack spacing={2}>
                {['Patient Portal', 'Doctor Portal', 'Hospital Admin', 'Security'].map((item) => (
                  <Typography key={item} variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', fontWeight: 500, '&:hover': { color: 'primary.main' } }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>Company</Typography>
              <Stack spacing={2}>
                {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                  <Typography key={item} variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', fontWeight: 500, '&:hover': { color: 'primary.main' } }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>Developer Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -3,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #3b82f6, #10b981)',
                      zIndex: 0
                    }
                  }}
                >
                  <Avatar 
                    src="https://github.com/Ojasvimishra.png" 
                    sx={{ 
                      width: 56, height: 56, 
                      position: 'relative',
                      zIndex: 1,
                      border: `2px solid ${theme.palette.background.paper}`
                    }} 
                  />
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={800} color="text.primary">Ojasvi Mishra</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={700}>Full Stack Developer</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                <Email sx={{ fontSize: 18, color: 'primary.main' }} /> ojasvimishra9792@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                <Phone sx={{ fontSize: 18, color: 'primary.main' }} /> +91-9044256927
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  href="https://github.com/Ojasvimishra" 
                  target="_blank"
                  startIcon={<GitHub />}
                  sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                >
                  GitHub
                </Button>
                <Button 
                  variant="outlined" 
                  href="http://www.linkedin.com/in/ojasvi-mishra2004" 
                  target="_blank"
                  startIcon={<LinkedIn />}
                  sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                >
                  LinkedIn
                </Button>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ mb: 4 }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              &copy; {new Date().getFullYear()} HOPDS System. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={4}>
              <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', fontWeight: 500, '&:hover': { color: 'text.primary' } }}>Privacy Policy</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer', fontWeight: 500, '&:hover': { color: 'text.primary' } }}>Terms of Service</Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
