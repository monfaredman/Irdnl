"use client";

import { useState } from "react";
import { Box, Button, Card, Stack, Typography, useTheme } from "@mui/material";
import { subscriptionPlans, coupons } from "@/data/mockContent";
import { formatCurrency } from "@/lib/formatters";
import { zarinpalCheckout } from "@/lib/integrations";

export const SubscriptionPlans = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const theme = useTheme();

  const handleCheckout = async (planId: string) => {
    const plan = subscriptionPlans.find((entry) => entry.id === planId);
    if (!plan) return;
    setLoadingPlan(planId);
    const coupon = coupons.find((entry) => entry.code === selectedCoupon);
    await zarinpalCheckout({
      planId: plan.id,
      price: plan.price,
      currency: plan.currency,
      couponCode: coupon?.code,
    });
    setTimeout(() => setLoadingPlan(null), 600);
  };

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  const glassStrongStyle = {
    background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.borderStrong || 'rgba(255, 255, 255, 0.18)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
  };

  const activeCouponStyle = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    boxShadow: `0 0 20px rgba(0, 212, 255, 0.5)`,
    color: '#fff',
  };

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {coupons.map((coupon) => (
          <Button
            key={coupon.code}
            onClick={() => setSelectedCoupon(coupon.code)}
            sx={{
              ...(selectedCoupon === coupon.code ? activeCouponStyle : glassStyle),
              borderRadius: '24px',
              px: 1.5,
              py: 0.75,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              color: selectedCoupon === coupon.code ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              border: selectedCoupon === coupon.code ? 'none' : `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.2)'}`,
              transition: 'all 0.2s',
              '&:hover': {
                ...(selectedCoupon !== coupon.code ? {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  transform: 'scale(1.05)',
                } : {}),
              },
            }}
          >
            {coupon.label}
          </Button>
        ))}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            sx={{
              ...(plan.featured ? {
                ...glassStrongStyle,
                borderColor: `${theme.palette.primary.light}80`,
                boxShadow: `0 0 40px rgba(0, 212, 255, 0.4)`,
              } : glassStyle),
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 4,
              p: 3,
                transition: 'all 0.4s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  '& .gradient-overlay': {
                    opacity: 1,
                  },
                },
              }}
            >
              {plan.featured && (
                <Box
                  className="gradient-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10, ${theme.palette.tertiary?.main || theme.palette.accent?.main || theme.palette.secondary.main}10)`,
                    opacity: 0,
                    transition: 'opacity 0.5s',
                  }}
                />
              )}
              <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {plan.name}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: '1.875rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {plan.price === 0 ? "Free" : formatCurrency(plan.price, plan.currency)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                  }}
                >
                  {plan.description}
                </Typography>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {plan.benefits.map((benefit) => (
                    <Stack key={benefit} direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.875rem',
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loadingPlan === plan.id}
                  sx={{
                    mt: 3,
                    width: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: '#fff',
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    boxShadow: `0 0 30px rgba(0, 212, 255, 0.3)`,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 0 40px rgba(0, 212, 255, 0.6)`,
                      '& .hover-gradient': {
                        opacity: 1,
                      },
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  <Box
                    className="hover-gradient"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary?.main || theme.palette.accent?.main || theme.palette.secondary.main} 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                  />
                  <Typography
                    component="span"
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {loadingPlan === plan.id ? "Processing…" : "Get access"}
                  </Typography>
                </Button>
              </Stack>
            </Card>
        ))}
      </Box>
    </Box>
  );
};
