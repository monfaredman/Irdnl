"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Divider,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassBlur,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    payment: "Payment",
    selectMethod: "Select Payment Method",
    creditCard: "Credit / Debit Card",
    bankTransfer: "Bank Transfer",
    paypal: "PayPal",
    cardDetails: "Card Details",
    cardNumber: "Card Number",
    cardName: "Name on Card",
    expiry: "Expiry Date",
    cvv: "CVV",
    saveCard: "Save card for future payments",
    orderSummary: "Order Summary",
    plan: "Plan",
    billing: "Billing",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    payNow: "Pay Now",
    secure: "Secure Payment",
    secureDesc: "Your payment is protected with 256-bit SSL encryption",
    monthly: "Monthly",
    yearly: "Yearly",
    premium: "Premium Plan",
    processing: "Processing...",
  },
  fa: {
    payment: "پرداخت",
    selectMethod: "روش پرداخت را انتخاب کنید",
    creditCard: "کارت اعتباری / نقدی",
    bankTransfer: "انتقال بانکی",
    paypal: "PayPal",
    cardDetails: "مشخصات کارت",
    cardNumber: "شماره کارت",
    cardName: "نام روی کارت",
    expiry: "تاریخ انقضا",
    cvv: "CVV",
    saveCard: "ذخیره کارت برای پرداخت‌های آینده",
    orderSummary: "خلاصه سفارش",
    plan: "پلن",
    billing: "دوره",
    subtotal: "جمع جزء",
    tax: "مالیات",
    total: "مجموع",
    payNow: "پرداخت",
    secure: "پرداخت امن",
    secureDesc: "پرداخت شما با رمزگذاری 256 بیتی SSL محافظت می‌شود",
    monthly: "ماهانه",
    yearly: "سالانه",
    premium: "پلن ویژه",
    processing: "در حال پردازش...",
  },
};

export default function PaymentPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  // Mock order data
  const order = {
    plan: t.premium,
    billing: t.yearly,
    subtotal: 199.00,
    tax: 19.90,
    total: 218.90,
  };

  const glassCardSx = {
    background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
    backdropFilter: `blur(${glassBlur.medium})`,
    border: `1px solid ${glassColors.glass.border}`,
    borderRadius: glassBorderRadius.xl,
    p: 3,
  };

  const glassInputSx = {
    "& .MuiOutlinedInput-root": {
      background: glassColors.glass.base,
      borderRadius: glassBorderRadius.lg,
      color: glassColors.text.primary,
      "& fieldset": { borderColor: glassColors.glass.border },
      "&:hover fieldset": { borderColor: `${glassColors.persianGold}60` },
      "&.Mui-focused fieldset": { borderColor: glassColors.persianGold },
    },
    "& .MuiInputLabel-root": {
      color: glassColors.text.tertiary,
      "&.Mui-focused": { color: glassColors.persianGold },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Handle success
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <PaymentIcon sx={{ color: glassColors.persianGold, fontSize: "2rem" }} />
        <Typography variant="h4" sx={{ color: glassColors.text.primary, fontWeight: 700 }}>
          {t.payment}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
          gap: 3,
        }}
      >
        {/* Payment Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <Box sx={{ ...glassCardSx, mb: 3 }}>
            <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 2 }}>
              {t.selectMethod}
            </Typography>

            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="card"
                control={
                  <Radio
                    sx={{
                      color: glassColors.text.tertiary,
                      "&.Mui-checked": { color: glassColors.persianGold },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CreditCardIcon sx={{ color: glassColors.text.secondary }} />
                    <Typography sx={{ color: glassColors.text.primary }}>
                      {t.creditCard}
                    </Typography>
                  </Box>
                }
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: glassBorderRadius.lg,
                  border: `1px solid ${paymentMethod === "card" ? glassColors.persianGold : glassColors.glass.border}`,
                  background: paymentMethod === "card" ? `${glassColors.persianGold}10` : "transparent",
                  m: 0,
                }}
              />
              <FormControlLabel
                value="bank"
                control={
                  <Radio
                    sx={{
                      color: glassColors.text.tertiary,
                      "&.Mui-checked": { color: glassColors.persianGold },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccountBalanceIcon sx={{ color: glassColors.text.secondary }} />
                    <Typography sx={{ color: glassColors.text.primary }}>
                      {t.bankTransfer}
                    </Typography>
                  </Box>
                }
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: glassBorderRadius.lg,
                  border: `1px solid ${paymentMethod === "bank" ? glassColors.persianGold : glassColors.glass.border}`,
                  background: paymentMethod === "bank" ? `${glassColors.persianGold}10` : "transparent",
                  m: 0,
                }}
              />
              <FormControlLabel
                value="paypal"
                control={
                  <Radio
                    sx={{
                      color: glassColors.text.tertiary,
                      "&.Mui-checked": { color: glassColors.persianGold },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PaymentIcon sx={{ color: glassColors.text.secondary }} />
                    <Typography sx={{ color: glassColors.text.primary }}>
                      {t.paypal}
                    </Typography>
                  </Box>
                }
                sx={{
                  p: 2,
                  borderRadius: glassBorderRadius.lg,
                  border: `1px solid ${paymentMethod === "paypal" ? glassColors.persianGold : glassColors.glass.border}`,
                  background: paymentMethod === "paypal" ? `${glassColors.persianGold}10` : "transparent",
                  m: 0,
                }}
              />
            </RadioGroup>
          </Box>

          {/* Card Details */}
          {paymentMethod === "card" && (
            <Box sx={glassCardSx}>
              <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 3 }}>
                {t.cardDetails}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label={t.cardNumber}
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
                  }
                  inputProps={{ maxLength: 19 }}
                  placeholder="1234 5678 9012 3456"
                  fullWidth
                  sx={glassInputSx}
                />

                <TextField
                  label={t.cardName}
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  placeholder="John Doe"
                  fullWidth
                  sx={glassInputSx}
                />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField
                    label={t.expiry}
                    value={formData.expiry}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry: formatExpiry(e.target.value) })
                    }
                    inputProps={{ maxLength: 5 }}
                    placeholder="MM/YY"
                    sx={glassInputSx}
                  />
                  <TextField
                    label={t.cvv}
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cvv: e.target.value.replace(/\D/g, "").substring(0, 4),
                      })
                    }
                    inputProps={{ maxLength: 4 }}
                    placeholder="123"
                    type="password"
                    sx={glassInputSx}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.saveCard}
                      onClick={() => setFormData({ ...formData, saveCard: !formData.saveCard })}
                      sx={{
                        color: glassColors.text.tertiary,
                        "&.Mui-checked": { color: glassColors.persianGold },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: glassColors.text.secondary, fontSize: "0.9rem" }}>
                      {t.saveCard}
                    </Typography>
                  }
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Order Summary */}
        <Box>
          <Box sx={glassCardSx}>
            <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 3 }}>
              {t.orderSummary}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: glassColors.text.tertiary }}>{t.plan}</Typography>
                <Typography sx={{ color: glassColors.text.primary, fontWeight: 500 }}>
                  {order.plan}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: glassColors.text.tertiary }}>{t.billing}</Typography>
                <Chip
                  label={order.billing}
                  size="small"
                  sx={{
                    background: `${glassColors.persianGold}20`,
                    color: glassColors.persianGold,
                  }}
                />
              </Box>

              <Divider sx={{ borderColor: glassColors.glass.border, my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: glassColors.text.tertiary }}>{t.subtotal}</Typography>
                <Typography sx={{ color: glassColors.text.primary }}>
                  ${order.subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: glassColors.text.tertiary }}>{t.tax}</Typography>
                <Typography sx={{ color: glassColors.text.primary }}>
                  ${order.tax.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: glassColors.glass.border, my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: glassColors.text.primary, fontWeight: 600 }}>
                  {t.total}
                </Typography>
                <Typography
                  sx={{
                    color: glassColors.persianGold,
                    fontWeight: 700,
                    fontSize: "1.25rem",
                  }}
                >
                  ${order.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              type="submit"
              disabled={isProcessing}
              onClick={handleSubmit}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: glassBorderRadius.lg,
                background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  background: `linear-gradient(135deg, ${glassColors.persianGold}CC, ${glassColors.persianGold})`,
                },
                "&:disabled": {
                  background: glassColors.glass.mid,
                  color: glassColors.text.tertiary,
                },
              }}
            >
              <LockIcon sx={{ fontSize: "1.2rem", mr: 1 }} />
              {isProcessing ? t.processing : t.payNow}
            </Button>

            {/* Security Notice */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
                p: 2,
                borderRadius: glassBorderRadius.lg,
                background: `${glassColors.glass.base}80`,
              }}
            >
              <SecurityIcon sx={{ color: "#22C55E", fontSize: "1.5rem" }} />
              <Box>
                <Typography sx={{ color: glassColors.text.primary, fontSize: "0.875rem", fontWeight: 500 }}>
                  {t.secure}
                </Typography>
                <Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.75rem" }}>
                  {t.secureDesc}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
