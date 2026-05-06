export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                    main: '#2563eb', // Royal Blue
                    light: '#60a5fa',
                    dark: '#1d4ed8',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#10b981', // Emerald
                    light: '#34d399',
                    dark: '#059669',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#f8fafc',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#0f172a',
                    secondary: '#475569',
                },
                divider: 'rgba(15, 23, 42, 0.08)',
            }
            : {
                // Dark mode palette
                primary: {
                    main: '#3b82f6', // Slightly lighter blue for dark mode
                    light: '#60a5fa',
                    dark: '#2563eb',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#10b981',
                    light: '#34d399',
                    dark: '#059669',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#020617', // Very dark slate
                    paper: '#0f172a', // Dark slate
                },
                text: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                },
                divider: 'rgba(248, 250, 252, 0.08)',
            }),
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
        h1: { fontWeight: 800, fontSize: '4.5rem', letterSpacing: '-0.04em', lineHeight: 1.1 },
        h2: { fontWeight: 800, fontSize: '3.5rem', letterSpacing: '-0.02em' },
        h3: { fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.02em' },
        h4: { fontWeight: 800 },
        h5: { fontWeight: 800 },
        h6: { fontWeight: 800 },
        body1: { fontSize: '1.1rem', lineHeight: 1.7 },
        button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: '12px',
                    padding: '10px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 16px -4px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`,
                    }
                }),
                containedPrimary: {
                    '&:hover': {
                        boxShadow: 'none',
                    }
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: '24px',
                    backgroundImage: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'light' 
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                    backgroundImage: 'none',
                },
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(2, 6, 23, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                }),
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
                head: ({ theme }) => ({
                    fontWeight: 700,
                    color: theme.palette.text.secondary,
                }),
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider,
                    },
                })
            }
        }
    },
});
