import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';

const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
        <Card
            sx={{
                height: '100%',
                bgcolor: 'background.paper',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => `0 12px 24px -4px ${alpha(color || theme.palette.primary.main, 0.2)}`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: alpha(color || '#2563eb', 0.1),
                            color: color || '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {Icon && <Icon sx={{ fontSize: 24 }} />}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
