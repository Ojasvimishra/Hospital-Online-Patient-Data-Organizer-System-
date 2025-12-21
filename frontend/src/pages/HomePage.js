import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Stack,
    useTheme,
    Chip,
    IconButton
} from '@mui/material';
import {
    LocalHospital,
    MedicalServices,
    Facebook,
    Twitter,
    LinkedIn,
    Instagram,
    CheckCircle,
    Stars
} from '@mui/icons-material';
import hospitalHero from '../assets/images/hospital_hero.jpg';
import drSarahJohnson from '../assets/images/dr_sarah_johnson.jpg';
import drJamesWilson from '../assets/images/dr_james_wilson.jpg';
import drEmilyChen from '../assets/images/dr_emily_chen.jpg';
import drMichaelBrown from '../assets/images/dr_michael_brown.jpg';
import medicalFacilities from '../assets/images/medical_facilities.jpg';

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const doctors = [
        { name: 'Dr. Sarah Johnson, MD', specialty: 'Chief Cardiologist', color: theme.palette.primary.main, exp: '15+ Years', image: drSarahJohnson },
        { name: 'Dr. James Wilson, PhD', specialty: 'Neurosurgeon', color: theme.palette.secondary.main, exp: '12+ Years', image: drJamesWilson },
        { name: 'Dr. Emily Chen, MD', specialty: 'Pediatric Specialist', color: theme.palette.primary.light, exp: '10+ Years', image: drEmilyChen },
        { name: 'Dr. Michael Brown, MS', specialty: 'Orthopedic Surgeon', color: theme.palette.secondary.light, exp: '18+ Years', image: drMichaelBrown },
    ];

    const medications = [
        { type: 'Antibiotics', count: '50+ Variants', desc: 'Full spectrum coverage' },
        { type: 'Analgesics', count: '30+ Types', desc: 'Pain management solutions' },
        { type: 'Cardiovascular', count: '45+ Brands', desc: 'Heart health essentials' },
        { type: 'Vitamins', count: '100+ Supplements', desc: 'Immunity & wellness' },
    ];

    const facilities = [
        { title: 'Advanced MRI & CT Scan', desc: 'High-resolution imaging for precise diagnosis using the latest Siemens Healthineers technology.' },
        { title: 'Robotic Surgery Theatre', desc: 'Minimally invasive procedures performed with da Vinci Surgical Systems for faster recovery.' },
        { title: 'Intensive Care Units (ICU)', desc: '24/7 monitored critical care beds with dedicated ventilators and life support systems.' },
        { title: 'Private Recovery Suites', desc: 'Luxury private rooms with automated beds, en-suite bathrooms, and guest accommodation.' },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'text.primary' }}>

            {/* Navbar */}
            <AppBar position="fixed" elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '80px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: 45, height: 45, borderRadius: '12px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 4px 10px ${theme.palette.primary.main}40`
                            }}>
                                <LocalHospital sx={{ color: '#fff', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" noWrap sx={{
                                    fontFamily: 'Outfit, sans-serif',
                                    fontWeight: 700,
                                    letterSpacing: '0.02em',
                                    lineHeight: 1,
                                    color: 'text.primary'
                                }}>
                                    SHREE RAVI SUPER SPECIALITY HOSPITAL
                                </Typography>
                                <Typography variant="caption" sx={{ letterSpacing: '0.2em', color: 'primary.main', fontWeight: 600 }}>MEDICAL CENTER</Typography>
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            {['Home', 'Doctors', 'Medications', 'Facilities'].map((item) => (
                                <Button
                                    key={item}
                                    color="inherit"
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    sx={{
                                        fontSize: '0.95rem',
                                        px: 2,
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        '&:hover': { color: 'primary.main', background: 'transparent' }
                                    }}
                                >
                                    {item}
                                </Button>
                            ))}
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{ ml: 3, borderRadius: '50px', px: 4, fontWeight: 700 }}
                            >
                                Login Portal
                            </Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section */}
            <Box id="home" sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '80px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(235,248,255,0.5) 0%, rgba(255,255,255,0) 100%)'
            }}>
                <Box
                    component="img"
                    src={hospitalHero}
                    sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: 0.1 }}
                />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                <Chip icon={<Stars sx={{ fontSize: '16px !important' }} />} label="JCI Accredited & ISO 9001:2015 Certified" color="primary" variant="outlined" sx={{ fontWeight: 600, border: `1px solid ${theme.palette.primary.light}` }} />
                            </Stack>
                            <Typography variant="h1" sx={{ mb: 3, color: 'text.primary' }}>
                                The Future of <br />
                                <span style={{ color: theme.palette.primary.main }}>Modern Healthcare</span>
                            </Typography>
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 5, fontWeight: 400, maxWidth: '650px', lineHeight: 1.6 }}>
                                Combining artificial intelligence, robotic surgery, and compassionate care to define the next generation of medical excellence.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/login')}
                                    sx={{ borderRadius: '10px', px: 4, fontWeight: 700, fontSize: '1.1rem', py: 1.5 }}
                                >
                                    Find a Doctor
                                </Button>
                            </Stack>

                            <Grid container spacing={4} sx={{ mt: 8 }}>
                                {[
                                    { label: 'Patient Satisfaction', val: '99.8%' },
                                    { label: 'Successful Surgeries', val: '50k+' },
                                    { label: 'Medical Specialists', val: '120+' }
                                ].map((stat, i) => (
                                    <Grid item key={i}>
                                        <Typography variant="h3" fontWeight={800} color="primary">{stat.val}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: 1 }}>{stat.label.toUpperCase()}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Facilities Section */}
            <Box id="facilities" sx={{ py: 15, position: 'relative', bgcolor: '#fff' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={medicalFacilities}
                                    sx={{
                                        width: '100%',
                                        borderRadius: '24px',
                                        boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute', bottom: -30, right: -30,
                                    bgcolor: 'background.paper', p: 4, borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    maxWidth: 280
                                }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>World-Class Infrastructure</Typography>
                                    <Typography variant="body2" color="text.secondary">Equipped with the only Neutron Therapy Center in the region.</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>FACILITIES AVAILABLE</Typography>
                            <Typography variant="h2" sx={{ mb: 4, mt: 1 }}>Cutting-Edge Medical Infrastructure</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 6 }}>
                                We believe that the best care requires the best tools. Our facility is designed to support complex medical procedures with maximum safety.
                            </Typography>
                            <Grid container spacing={3}>
                                {facilities.map((fac, idx) => (
                                    <Grid item xs={12} sm={6} key={idx}>
                                        <Box sx={{ p: 3, borderLeft: `3px solid ${theme.palette.primary.main}`, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '0 8px 8px 0' }}>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>{fac.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{fac.desc}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Doctors Section */}
            <Box id="doctors" sx={{ py: 15, bgcolor: '#F4F6F8' }}>
                <Container maxWidth="xl">
                    <Box sx={{ textAlign: 'center', mb: 10, maxWidth: 800, mx: 'auto' }}>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>OUR SPECIALISTS</Typography>
                        <Typography variant="h2" sx={{ mb: 2 }}>Board-Certified Experts</Typography>
                        <Typography color="text.secondary">Our team consists of internationally trained specialists pushing the boundaries of medicine.</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {doctors.map((doctor, index) => (
                            <Grid item xs={1} sm={6} md={3} key={index}>
                                <Card sx={{
                                    height: '100%',
                                    transition: 'all 0.4s ease',
                                    '&:hover': { transform: 'translateY(-12px)', boxShadow: `0 20px 50px ${doctor.color}30` },
                                    borderTop: `4px solid ${doctor.color}`
                                }}>
                                    <Box sx={{ height: 300, position: 'relative', overflow: 'hidden', bgcolor: '#f0f0f0' }}>
                                        <Box component="img" src={doctor.image} sx={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                        }} />
                                        {/* <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                                            <Stack direction="row" justifyContent="center" spacing={1}>
                                                <IconButton size="small" sx={{ color: 'white', '&:hover': { bgcolor: doctor.color } }}><LinkedIn /></IconButton>
                                                <IconButton size="small" sx={{ color: 'white', '&:hover': { bgcolor: doctor.color } }}><Twitter /></IconButton>
                                            </Stack>
                                        </Box> */}
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                                        <Typography variant="h6" fontWeight={700}>{doctor.name}</Typography>
                                        <Typography variant="subtitle2" sx={{ color: doctor.color, fontWeight: 600, mb: 1 }}>{doctor.specialty}</Typography>
                                        <Typography variant="caption" color="text.secondary">Experience: {doctor.exp}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Medications Section */}
            <Box id="medications" sx={{ py: 15 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Typography variant="overline" color="primary" fontWeight={700} sx={{ letterSpacing: 2 }}>PHARMACY SERVICES</Typography>
                            <Typography variant="h2" sx={{ mb: 3 }}>24/7 On-Site Pharmacy</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                                Our automated pharmacy dispensing system ensures 99.9% accuracy. We stock a comprehensive range of specialized medications.
                            </Typography>
                            {/* <Stack spacing={2}>
                                {[1, 2, 3].map(i => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircle color="success" sx={{ fontSize: 20 }} />
                                        <Typography color="text.secondary">International FDA Approved Drugs</Typography>
                                    </Box>
                                ))}
                            </Stack> */}
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={3}>
                                {medications.map((med, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Card sx={{ p: 2, height: '100%', border: '1px solid rgba(0,0,0,0.05)', '&:hover': { borderColor: theme.palette.primary.main, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }}>
                                            <CardContent>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                                    <MedicalServices sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
                                                    <Chip label="Available" color="success" size="small" variant="outlined" />
                                                </Stack>
                                                <Typography variant="h5" fontWeight={700} gutterBottom>{med.type}</Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>{med.desc}</Typography>
                                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>{med.count}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: '#1A2027', color: 'white', py: 8 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 3 }}>
                                    <LocalHospital color="primary" sx={{ fontSize: 30 }} />
                                    <Typography variant="h5" fontWeight={700}>SHREE RAVI SUPER SPECIALITY HOSPITAL</Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'grey.500', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
                                    Marnstack Medical Center is a JCI accredited facility committed to providing the highest standards of healthcare excellence and patient safety.
                                </Typography>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3, color: 'white' }}>Quick Links</Typography>
                            <Stack spacing={1.5}>
                                {['About Us', 'Find a Doctor', 'Services', 'Quality & Safety', 'Contact'].map(link => (
                                    <Typography key={link} variant="body2" sx={{ color: 'grey.500', cursor: 'pointer', transition: '0.2s', '&:hover': { color: theme.palette.primary.main } }}>{link}</Typography>
                                ))}
                            </Stack>
                        </Grid> */}
                        {/* <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3, color: 'white' }}>Departments</Typography>
                            <Stack spacing={1.5}>
                                {['Cardiology Center', 'Neuroscience Institute', 'Cancer Center', 'Orthopedics', 'Women\'s Health'].map(link => (
                                    <Typography key={link} variant="body2" sx={{ color: 'grey.500', cursor: 'pointer', transition: '0.2s', '&:hover': { color: theme.palette.primary.main } }}>{link}</Typography>
                                ))}
                            </Stack>
                        </Grid> */}
                        {/* <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3, color: 'white' }}>Stay Connected</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <Box component="input" placeholder="Enter your email" sx={{
                                    flex: 1, px: 2, py: 1.5, borderRadius: '8px', border: '1px solid #333', bgcolor: '#2C3E50', color: 'white', outline: 'none',
                                    '&:focus': { borderColor: theme.palette.primary.main }
                                }} />
                                <Button variant="contained">Subscribe</Button>
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}><Facebook /></IconButton>
                                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}><Twitter /></IconButton>
                                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}><LinkedIn /></IconButton>
                                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}><Instagram /></IconButton>
                            </Stack>
                        </Grid> */}
                    </Grid>
                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 8, pt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            &copy; 2025 Marnstack Medical Center. Privacy Policy | Terms of Service
                        </Typography>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
};

export default HomePage;
