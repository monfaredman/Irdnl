import type { Metadata } from "next";
import { Box, Container, Stack, Typography } from "@mui/material";
import { AccountOverview } from "@/components/sections/AccountOverview";
import { BillingHistory } from "@/components/sections/BillingHistory";
import { SubscriptionPlans } from "@/components/sections/SubscriptionPlans";

export const metadata: Metadata = {
  title: "Account | irdnl",
  description: "Manage irdnl profiles, billing, and device preferences.",
};

export default function AccountPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={5}>
        <Box component="header">
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Account
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '1.875rem', fontWeight: 600, color: '#fff', mt: 0.5 }}>
            Manage your experience
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
            Update playback defaults, view billing history, and upgrade plans.
          </Typography>
        </Box>
        <AccountOverview />
        <SubscriptionPlans />
        <BillingHistory />
      </Stack>
    </Container>
  );
}
