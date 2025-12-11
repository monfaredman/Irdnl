"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import BarChartIcon from "@mui/icons-material/BarChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassBlur,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    title: "Cookie Policy",
    subtitle: "Manage your cookie preferences",
    lastUpdated: "Last updated: January 2025",
    intro:
      "We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. By clicking accept, you agree to this as outlined in our Cookie Policy.",
    whatAreCookies: {
      title: "What Are Cookies?",
      content:
        "Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, understand how you use our platform, and improve your experience.",
    },
    categories: {
      title: "Cookie Categories",
      essential: {
        title: "Essential Cookies",
        description:
          "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as setting your privacy preferences, logging in, or filling in forms.",
        required: true,
      },
      analytics: {
        title: "Analytics Cookies",
        description:
          "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.",
        required: false,
      },
      marketing: {
        title: "Marketing Cookies",
        description:
          "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant ads on other sites.",
        required: false,
      },
      preferences: {
        title: "Preference Cookies",
        description:
          "These cookies enable the website to remember information that changes the way the site behaves or looks, like your preferred language or the region you are in.",
        required: false,
      },
    },
    howWeUse: {
      title: "How We Use Cookies",
      items: [
        "Remember your login credentials and preferences",
        "Understand how you navigate our platform",
        "Personalize content and recommendations",
        "Measure and improve our services",
        "Provide relevant advertisements",
        "Ensure security and prevent fraud",
      ],
    },
    yourChoices: {
      title: "Your Choices",
      content:
        "You can manage your cookie preferences at any time using the controls below. You can also configure your browser to refuse cookies, although this may affect the functionality of our service.",
    },
    manageCookies: "Manage Cookie Preferences",
    savePreferences: "Save Preferences",
    acceptAll: "Accept All",
    rejectNonEssential: "Reject Non-Essential",
    enabled: "Enabled",
    disabled: "Disabled",
    required: "Required",
  },
  fa: {
    title: "سیاست کوکی",
    subtitle: "تنظیمات کوکی‌های خود را مدیریت کنید",
    lastUpdated: "آخرین به‌روزرسانی: دی ۱۴۰۳",
    intro:
      "ما از کوکی‌ها و فناوری‌های مشابه برای شخصی‌سازی محتوا، سنجش تبلیغات و ارائه تجربه بهتر استفاده می‌کنیم. با کلیک روی پذیرش، شما با این موارد طبق سیاست کوکی ما موافقت می‌کنید.",
    whatAreCookies: {
      title: "کوکی چیست؟",
      content:
        "کوکی‌ها فایل‌های متنی کوچکی هستند که هنگام بازدید از وب‌سایت ما روی دستگاه شما ذخیره می‌شوند. آن‌ها به ما کمک می‌کنند تا ترجیحات شما را به خاطر بسپاریم و تجربه شما را بهبود بخشیم.",
    },
    categories: {
      title: "دسته‌بندی کوکی‌ها",
      essential: {
        title: "کوکی‌های ضروری",
        description:
          "این کوکی‌ها برای عملکرد وب‌سایت ضروری هستند و نمی‌توان آن‌ها را غیرفعال کرد. معمولاً در پاسخ به اقدامات شما مانند تنظیم ترجیحات حریم خصوصی یا ورود به سیستم تنظیم می‌شوند.",
        required: true,
      },
      analytics: {
        title: "کوکی‌های تحلیلی",
        description:
          "این کوکی‌ها به ما امکان می‌دهند بازدیدها و منابع ترافیک را شمارش کنیم تا بتوانیم عملکرد سایت خود را بسنجیم و بهبود دهیم.",
        required: false,
      },
      marketing: {
        title: "کوکی‌های بازاریابی",
        description:
          "این کوکی‌ها ممکن است توسط شرکای تبلیغاتی ما تنظیم شوند. ممکن است برای ایجاد پروفایلی از علایق شما و نمایش تبلیغات مرتبط استفاده شوند.",
        required: false,
      },
      preferences: {
        title: "کوکی‌های ترجیحات",
        description:
          "این کوکی‌ها به وب‌سایت امکان می‌دهند اطلاعاتی را به خاطر بسپارد که نحوه رفتار یا ظاهر سایت را تغییر می‌دهد، مانند زبان ترجیحی شما.",
        required: false,
      },
    },
    howWeUse: {
      title: "نحوه استفاده ما از کوکی‌ها",
      items: [
        "به خاطر سپردن اطلاعات ورود و ترجیحات شما",
        "درک نحوه استفاده شما از پلتفرم ما",
        "شخصی‌سازی محتوا و پیشنهادات",
        "سنجش و بهبود خدمات ما",
        "ارائه تبلیغات مرتبط",
        "تضمین امنیت و جلوگیری از تقلب",
      ],
    },
    yourChoices: {
      title: "انتخاب‌های شما",
      content:
        "شما می‌توانید در هر زمان تنظیمات کوکی خود را با استفاده از کنترل‌های زیر مدیریت کنید. همچنین می‌توانید مرورگر خود را برای رد کوکی‌ها پیکربندی کنید.",
    },
    manageCookies: "مدیریت تنظیمات کوکی",
    savePreferences: "ذخیره تنظیمات",
    acceptAll: "پذیرش همه",
    rejectNonEssential: "رد کوکی‌های غیرضروری",
    enabled: "فعال",
    disabled: "غیرفعال",
    required: "ضروری",
  },
};

const categoryIcons = {
  essential: SecurityIcon,
  analytics: BarChartIcon,
  marketing: CampaignIcon,
  preferences: SettingsIcon,
};

export default function CookiesPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true,
  });

  const glassCardSx = {
    background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
    backdropFilter: `blur(${glassBlur.medium})`,
    border: `1px solid ${glassColors.glass.border}`,
    borderRadius: glassBorderRadius.xl,
    p: 4,
  };

  const handleToggle = (category: string) => {
    if (category === "essential") return; // Can't disable essential cookies
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleRejectNonEssential = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          ...glassCardSx,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: glassBorderRadius.lg,
            background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CookieIcon sx={{ fontSize: "2rem", color: "#000" }} />
        </Box>
        <Box>
          <Typography
            variant="h3"
            sx={{ color: glassColors.text.primary, fontWeight: 800, mb: 0.5 }}
          >
            {t.title}
          </Typography>
          <Typography sx={{ color: glassColors.text.tertiary }}>
            {t.lastUpdated}
          </Typography>
        </Box>
      </Box>

      {/* Introduction */}
      <Box sx={{ ...glassCardSx, mb: 4 }}>
        <Typography sx={{ color: glassColors.text.secondary, lineHeight: 1.8 }}>
          {t.intro}
        </Typography>
      </Box>

      {/* What Are Cookies */}
      <Box sx={{ ...glassCardSx, mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 2 }}
        >
          {t.whatAreCookies.title}
        </Typography>
        <Typography sx={{ color: glassColors.text.secondary, lineHeight: 1.8 }}>
          {t.whatAreCookies.content}
        </Typography>
      </Box>

      {/* Cookie Categories */}
      <Box sx={{ ...glassCardSx, mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
        >
          {t.categories.title}
        </Typography>
        {(["essential", "analytics", "marketing", "preferences"] as const).map(
          (category) => {
            const Icon = categoryIcons[category];
            const catData = t.categories[category];
            const isEnabled =
              cookiePreferences[category as keyof typeof cookiePreferences];

            return (
              <Accordion
                key={category}
                sx={{
                  background: `${glassColors.glass.base}`,
                  border: `1px solid ${glassColors.glass.border}`,
                  borderRadius: `${glassBorderRadius.md} !important`,
                  mb: 2,
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    margin: 0,
                    mb: 2,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: glassColors.text.secondary }} />
                  }
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      gap: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: glassBorderRadius.sm,
                      background: `${glassColors.persianGold}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon sx={{ color: glassColors.persianGold }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ color: glassColors.text.primary, fontWeight: 600 }}
                    >
                      {catData.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {catData.required ? (
                      <Typography
                        sx={{
                          color: glassColors.text.tertiary,
                          fontSize: "0.875rem",
                        }}
                      >
                        {t.required}
                      </Typography>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            color: isEnabled
                              ? glassColors.persianGold
                              : glassColors.text.tertiary,
                            fontSize: "0.875rem",
                          }}
                        >
                          {isEnabled ? t.enabled : t.disabled}
                        </Typography>
                        <Switch
                          checked={isEnabled}
                          onChange={() => handleToggle(category)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: glassColors.persianGold,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: glassColors.persianGold,
                              },
                          }}
                        />
                      </>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: glassColors.text.secondary }}>
                    {catData.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          }
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={handleAcceptAll}
            sx={{
              background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
              color: "#000",
              fontWeight: 600,
              borderRadius: glassBorderRadius.md,
              px: 4,
              "&:hover": {
                background: glassColors.persianGold,
              },
            }}
          >
            {t.acceptAll}
          </Button>
          <Button
            variant="outlined"
            onClick={handleRejectNonEssential}
            sx={{
              borderColor: glassColors.glass.border,
              color: glassColors.text.primary,
              fontWeight: 600,
              borderRadius: glassBorderRadius.md,
              px: 4,
              "&:hover": {
                borderColor: glassColors.text.primary,
                background: `${glassColors.glass.base}`,
              },
            }}
          >
            {t.rejectNonEssential}
          </Button>
          <Button
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
              color: glassColors.text.primary,
              fontWeight: 600,
              borderRadius: glassBorderRadius.md,
              border: `1px solid ${glassColors.glass.border}`,
              px: 4,
              "&:hover": {
                background: `${glassColors.glass.strong}`,
              },
            }}
          >
            {t.savePreferences}
          </Button>
        </Box>
      </Box>

      {/* How We Use Cookies */}
      <Box sx={{ ...glassCardSx, mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
        >
          {t.howWeUse.title}
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {t.howWeUse.items.map((item, index) => (
            <Box
              component="li"
              key={index}
              sx={{
                color: glassColors.text.secondary,
                mb: 1.5,
                lineHeight: 1.6,
                "&::marker": {
                  color: glassColors.persianGold,
                },
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Your Choices */}
      <Box sx={{ ...glassCardSx }}>
        <Typography
          variant="h5"
          sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 2 }}
        >
          {t.yourChoices.title}
        </Typography>
        <Typography sx={{ color: glassColors.text.secondary, lineHeight: 1.8 }}>
          {t.yourChoices.content}
        </Typography>
      </Box>
    </Box>
  );
}
