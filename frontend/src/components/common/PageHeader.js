import React from 'react';
import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, action, icon: Icon }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[1],
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
                {Icon && (
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            display: 'flex',
                        }}
                    >
                        <Icon sx={{ fontSize: 32 }} />
                    </Box>
                )}
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {action && (
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {action}
                </Box>
            )}

            {/* Decorative Background */}
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '30%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
                }}
            />
        </Box>
    );
};

export default PageHeader;
