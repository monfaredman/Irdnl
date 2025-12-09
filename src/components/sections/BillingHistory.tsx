"use client";

import { Box, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { billingHistory } from "@/data/mockContent";
import { formatCurrency, formatDate } from "@/lib/formatters";

export const BillingHistory = () => {
  const theme = useTheme();

  const glassStrongStyle = {
    background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.borderStrong || 'rgba(255, 255, 255, 0.18)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
  };

  const glassSubtleStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  return (
    <Card sx={{ ...glassStrongStyle, borderRadius: 4, p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
        Billing history
      </Typography>
      <Stack spacing={1.5}>
        {billingHistory.map((item) => (
          <Card
            key={item.id}
            sx={{
              ...glassSubtleStyle,
              borderRadius: 3,
              px: 2,
              py: 1.5,
              transition: 'all 0.3s',
              '&:hover': {
                ...glassStyle,
                '& .title': {
                  color: '#fff',
                },
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography
                  className="title"
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.8)',
                    transition: 'color 0.3s',
                  }}
                >
                  {item.plan}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {formatDate(item.date)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  {formatCurrency(item.amount)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.palette.primary.light,
                  }}
                >
                  {item.status}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
};
