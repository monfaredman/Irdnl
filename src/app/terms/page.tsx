"use client";

import { Box, Typography, Divider } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassBlur,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully",
    lastUpdated: "Last updated",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: "By accessing and using PersiaPlay, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
      },
      {
        title: "2. Description of Service",
        content: "PersiaPlay provides a streaming service that allows subscribers to access movies, TV shows, and other content over the internet. The content available may vary by geographic location and is subject to change.",
      },
      {
        title: "3. Account Registration",
        content: "To use our services, you must create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
      },
      {
        title: "4. Subscription and Billing",
        content: "Subscriptions are billed on a recurring basis. You authorize us to charge your payment method for the subscription plan you select. You may cancel your subscription at any time, but no refunds are provided for partial billing periods.",
      },
      {
        title: "5. Content Usage",
        content: "Content on PersiaPlay is for personal, non-commercial use only. You may not copy, reproduce, distribute, or create derivative works from our content without express written permission.",
      },
      {
        title: "6. User Conduct",
        content: "You agree not to: circumvent content protection measures, share your account credentials, use automated systems to access the service, or engage in any activity that disrupts our services.",
      },
      {
        title: "7. Intellectual Property",
        content: "All content, trademarks, and intellectual property on PersiaPlay are owned by us or our licensors. You do not acquire any ownership rights by using our services.",
      },
      {
        title: "8. Termination",
        content: "We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent or illegal activity.",
      },
      {
        title: "9. Limitation of Liability",
        content: "PersiaPlay is provided 'as is' without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.",
      },
      {
        title: "10. Changes to Terms",
        content: "We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the new terms.",
      },
    ],
  },
  fa: {
    title: "شرایط خدمات",
    subtitle: "لطفاً این شرایط را با دقت مطالعه کنید",
    lastUpdated: "آخرین به‌روزرسانی",
    sections: [
      {
        title: "۱. پذیرش شرایط",
        content: "با دسترسی و استفاده از پرشیاپلی، شما موافقت می‌کنید که به این شرایط خدمات متعهد باشید. اگر با این شرایط موافق نیستید، لطفاً از خدمات ما استفاده نکنید.",
      },
      {
        title: "۲. شرح خدمات",
        content: "پرشیاپلی یک سرویس استریمینگ ارائه می‌دهد که به مشترکین اجازه دسترسی به فیلم‌ها، سریال‌ها و سایر محتوا از طریق اینترنت را می‌دهد. محتوای موجود ممکن است بر اساس موقعیت جغرافیایی متفاوت باشد.",
      },
      {
        title: "۳. ثبت‌نام حساب کاربری",
        content: "برای استفاده از خدمات ما، باید یک حساب کاربری ایجاد کنید و اطلاعات دقیق ارائه دهید. شما مسئول حفظ محرمانگی اطلاعات حساب خود و تمام فعالیت‌های تحت حساب خود هستید.",
      },
      {
        title: "۴. اشتراک و صورتحساب",
        content: "اشتراک‌ها به صورت تکراری صورتحساب می‌شوند. شما به ما اجازه می‌دهید که روش پرداخت شما را برای پلن اشتراک انتخابی شما شارژ کنیم. می‌توانید هر زمان اشتراک خود را لغو کنید، اما بازپرداختی برای دوره‌های ناقص ارائه نمی‌شود.",
      },
      {
        title: "۵. استفاده از محتوا",
        content: "محتوای پرشیاپلی فقط برای استفاده شخصی و غیرتجاری است. شما نمی‌توانید بدون اجازه کتبی صریح، محتوای ما را کپی، بازتولید، توزیع یا آثار مشتقه از آن ایجاد کنید.",
      },
      {
        title: "۶. رفتار کاربر",
        content: "شما موافقت می‌کنید که: اقدامات حفاظت از محتوا را دور نزنید، اطلاعات حساب خود را به اشتراک نگذارید، از سیستم‌های خودکار برای دسترسی به سرویس استفاده نکنید، یا در هیچ فعالیتی که خدمات ما را مختل کند شرکت نکنید.",
      },
      {
        title: "۷. مالکیت معنوی",
        content: "تمام محتوا، علائم تجاری و مالکیت معنوی در پرشیاپلی متعلق به ما یا صاحبان مجوز ماست. شما با استفاده از خدمات ما هیچ حق مالکیتی کسب نمی‌کنید.",
      },
      {
        title: "۸. خاتمه",
        content: "ما حق داریم در صورت نقض این شرایط یا مشارکت در فعالیت تقلبی یا غیرقانونی، حساب شما را معلق یا خاتمه دهیم.",
      },
      {
        title: "۹. محدودیت مسئولیت",
        content: "پرشیاپلی 'همانطور که هست' بدون ضمانت ارائه می‌شود. ما مسئول هیچ خسارت غیرمستقیم، تصادفی یا تبعی ناشی از استفاده شما از خدمات ما نیستیم.",
      },
      {
        title: "۱۰. تغییرات در شرایط",
        content: "ما ممکن است این شرایط را هر از گاهی به‌روزرسانی کنیم. ادامه استفاده از خدمات ما پس از تغییرات به معنای پذیرش شرایط جدید است.",
      },
    ],
  },
};

export default function TermsPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const glassCardSx = {
    background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
    backdropFilter: `blur(${glassBlur.medium})`,
    border: `1px solid ${glassColors.glass.border}`,
    borderRadius: glassBorderRadius.xl,
    p: 4,
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
          <GavelIcon sx={{ fontSize: "2rem", color: "#000" }} />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ color: glassColors.text.primary, fontWeight: 800, mb: 0.5 }}>
            {t.title}
          </Typography>
          <Typography sx={{ color: glassColors.text.tertiary }}>
            {t.subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Last Updated */}
      <Typography sx={{ color: glassColors.text.tertiary, mb: 3 }}>
        {t.lastUpdated}: December 1, 2025
      </Typography>

      {/* Content */}
      <Box sx={glassCardSx}>
        {t.sections.map((section, index) => (
          <Box key={index}>
            <Typography
              variant="h6"
              sx={{
                color: glassColors.persianGold,
                fontWeight: 600,
                mb: 2,
              }}
            >
              {section.title}
            </Typography>
            <Typography
              sx={{
                color: glassColors.text.secondary,
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              {section.content}
            </Typography>
            {index < t.sections.length - 1 && (
              <Divider sx={{ borderColor: glassColors.glass.border, mb: 3 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
