import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0288d1', // Professional Blue
            light: '#5eb8ff',
            dark: '#005b9f',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#26a69a', // Teal/Aqua suitable for medical
            light: '#64d8cb',
            dark: '#00766c',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F4F6F8', // Soft gray background
            paper: '#FFFFFF',   // White cards
        },
        text: {
            primary: '#1A2027', // Dark gray for readability
            secondary: '#3E5060', // Muted blue-grey
        },
        action: {
            active: '#0288d1',
            hover: 'rgba(2, 136, 209, 0.08)',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '4rem',
            letterSpacing: '-0.02em',
            color: '#0288d1',
        },
        h2: {
            fontWeight: 700,
            fontSize: '3rem',
            letterSpacing: '-0.01em',
            color: '#1A2027',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2.25rem',
            color: '#26a69a',
        },
        body1: {
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: '#3E5060',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '12px 28px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: '#ffffff',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease-in-out',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    color: '#1A2027',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                }
            }
        }
    },
});

export default theme;
