"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Button,
  Slider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import StorageIcon from "@mui/icons-material/Storage";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassBlur,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    settings: "Settings",
    appearance: "Appearance",
    language: "Language",
    theme: "Dark Theme",
    notifications: "Notifications",
    emailNotifs: "Email Notifications",
    pushNotifs: "Push Notifications",
    playback: "Playback",
    autoplay: "Autoplay Next Episode",
    quality: "Default Quality",
    subtitles: "Default Subtitles",
    subtitleSize: "Subtitle Size",
    parental: "Parental Controls",
    kidsMode: "Kids Mode",
    pinRequired: "Require PIN for mature content",
    storage: "Storage & Data",
    clearCache: "Clear Cache",
    clearHistory: "Clear Watch History",
    downloadQuality: "Download Quality",
    deleteAccount: "Delete Account",
    deleteWarning: "This action cannot be undone",
    saveChanges: "Save Changes",
    english: "English",
    persian: "Persian (فارسی)",
    auto: "Auto",
    low: "Low (480p)",
    medium: "Medium (720p)",
    high: "High (1080p)",
    ultra: "Ultra (4K)",
    small: "Small",
    large: "Large",
  },
  fa: {
    settings: "تنظیمات",
    appearance: "ظاهر",
    language: "زبان",
    theme: "تم تاریک",
    notifications: "اعلان‌ها",
    emailNotifs: "اعلان‌های ایمیل",
    pushNotifs: "اعلان‌های پوش",
    playback: "پخش",
    autoplay: "پخش خودکار قسمت بعدی",
    quality: "کیفیت پیش‌فرض",
    subtitles: "زیرنویس پیش‌فرض",
    subtitleSize: "اندازه زیرنویس",
    parental: "کنترل والدین",
    kidsMode: "حالت کودک",
    pinRequired: "نیاز به PIN برای محتوای بزرگسال",
    storage: "حافظه و داده",
    clearCache: "پاک کردن کش",
    clearHistory: "پاک کردن تاریخچه",
    downloadQuality: "کیفیت دانلود",
    deleteAccount: "حذف حساب",
    deleteWarning: "این عمل قابل بازگشت نیست",
    saveChanges: "ذخیره تغییرات",
    english: "English",
    persian: "فارسی",
    auto: "خودکار",
    low: "پایین (480p)",
    medium: "متوسط (720p)",
    high: "بالا (1080p)",
    ultra: "فوق‌العاده (4K)",
    small: "کوچک",
    large: "بزرگ",
  },
};

// Component moved outside to satisfy React Compiler requirements
function SettingRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Icon sx={{ color: glassColors.text.tertiary }} />
        <Typography sx={{ color: glassColors.text.primary }}>{label}</Typography>
      </Box>
      {children}
    </Box>
  );
}

const glassCardSx = {
  background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
  backdropFilter: `blur(${glassBlur.medium})`,
  border: `1px solid ${glassColors.glass.border}`,
  borderRadius: glassBorderRadius.xl,
  p: 3,
  mb: 3,
};

const glassSelectSx = {
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
  "& .MuiSelect-icon": { color: glassColors.text.tertiary },
};

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language] || translations.en;

  const [settings, setSettings] = useState({
    darkMode: true,
    emailNotifs: true,
    pushNotifs: false,
    autoplay: true,
    quality: "auto",
    subtitles: "fa",
    subtitleSize: 50,
    kidsMode: false,
    pinRequired: false,
    downloadQuality: "high",
  });

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <SettingsIcon sx={{ color: glassColors.persianGold, fontSize: "2rem" }} />
        <Typography variant="h4" sx={{ color: glassColors.text.primary, fontWeight: 700 }}>
          {t.settings}
        </Typography>
      </Box>

      {/* Appearance */}
      <Box sx={glassCardSx}>
        <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 2 }}>
          {t.appearance}
        </Typography>
        
        <SettingRow icon={LanguageIcon} label={t.language}>
          <FormControl size="small" sx={{ minWidth: 150, ...glassSelectSx }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "fa")}
            >
              <MenuItem value="en">{t.english}</MenuItem>
              <MenuItem value="fa">{t.persian}</MenuItem>
            </Select>
          </FormControl>
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <SettingRow icon={DarkModeIcon} label={t.theme}>
          <Switch
            checked={settings.darkMode}
            onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: glassColors.persianGold,
                "& + .MuiSwitch-track": {
                  backgroundColor: glassColors.persianGold,
                },
              },
            }}
          />
        </SettingRow>
      </Box>

      {/* Notifications */}
      <Box sx={glassCardSx}>
        <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 2 }}>
          {t.notifications}
        </Typography>

        <SettingRow icon={NotificationsIcon} label={t.emailNotifs}>
          <Switch
            checked={settings.emailNotifs}
            onChange={(e) => setSettings({ ...settings, emailNotifs: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: glassColors.persianGold,
              },
            }}
          />
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <SettingRow icon={NotificationsIcon} label={t.pushNotifs}>
          <Switch
            checked={settings.pushNotifs}
            onChange={(e) => setSettings({ ...settings, pushNotifs: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: glassColors.persianGold,
              },
            }}
          />
        </SettingRow>
      </Box>

      {/* Playback */}
      <Box sx={glassCardSx}>
        <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 2 }}>
          {t.playback}
        </Typography>

        <SettingRow icon={PlayCircleIcon} label={t.autoplay}>
          <Switch
            checked={settings.autoplay}
            onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: glassColors.persianGold,
              },
            }}
          />
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <SettingRow icon={PlayCircleIcon} label={t.quality}>
          <FormControl size="small" sx={{ minWidth: 150, ...glassSelectSx }}>
            <Select
              value={settings.quality}
              onChange={(e) => setSettings({ ...settings, quality: e.target.value })}
            >
              <MenuItem value="auto">{t.auto}</MenuItem>
              <MenuItem value="low">{t.low}</MenuItem>
              <MenuItem value="medium">{t.medium}</MenuItem>
              <MenuItem value="high">{t.high}</MenuItem>
              <MenuItem value="ultra">{t.ultra}</MenuItem>
            </Select>
          </FormControl>
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <SettingRow icon={SubtitlesIcon} label={t.subtitles}>
          <FormControl size="small" sx={{ minWidth: 150, ...glassSelectSx }}>
            <Select
              value={settings.subtitles}
              onChange={(e) => setSettings({ ...settings, subtitles: e.target.value })}
            >
              <MenuItem value="off">Off</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fa">فارسی</MenuItem>
            </Select>
          </FormControl>
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <Box sx={{ py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <SubtitlesIcon sx={{ color: glassColors.text.tertiary }} />
            <Typography sx={{ color: glassColors.text.primary }}>{t.subtitleSize}</Typography>
          </Box>
          <Box sx={{ px: 2 }}>
            <Slider
              value={settings.subtitleSize}
              onChange={(_, value) => setSettings({ ...settings, subtitleSize: value as number })}
              min={25}
              max={100}
              marks={[
                { value: 25, label: t.small },
                { value: 100, label: t.large },
              ]}
              sx={{
                color: glassColors.persianGold,
                "& .MuiSlider-markLabel": { color: glassColors.text.tertiary },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Parental Controls */}
      <Box sx={glassCardSx}>
        <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 2 }}>
          {t.parental}
        </Typography>

        <SettingRow icon={ChildCareIcon} label={t.kidsMode}>
          <Switch
            checked={settings.kidsMode}
            onChange={(e) => setSettings({ ...settings, kidsMode: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: glassColors.persianGold,
              },
            }}
          />
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <SettingRow icon={ChildCareIcon} label={t.pinRequired}>
          <Switch
            checked={settings.pinRequired}
            onChange={(e) => setSettings({ ...settings, pinRequired: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: glassColors.persianGold,
              },
            }}
          />
        </SettingRow>
      </Box>

      {/* Storage */}
      <Box sx={glassCardSx}>
        <Typography variant="h6" sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 2 }}>
          {t.storage}
        </Typography>

        <SettingRow icon={StorageIcon} label={t.downloadQuality}>
          <FormControl size="small" sx={{ minWidth: 150, ...glassSelectSx }}>
            <Select
              value={settings.downloadQuality}
              onChange={(e) => setSettings({ ...settings, downloadQuality: e.target.value })}
            >
              <MenuItem value="low">{t.low}</MenuItem>
              <MenuItem value="medium">{t.medium}</MenuItem>
              <MenuItem value="high">{t.high}</MenuItem>
            </Select>
          </FormControl>
        </SettingRow>

        <Divider sx={{ borderColor: glassColors.glass.border }} />

        <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
          <Button
            startIcon={<StorageIcon />}
            sx={{
              borderRadius: glassBorderRadius.lg,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.secondary,
              textTransform: "none",
              "&:hover": { borderColor: glassColors.persianGold },
            }}
          >
            {t.clearCache}
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: glassBorderRadius.lg,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.secondary,
              textTransform: "none",
              "&:hover": { borderColor: glassColors.persianGold },
            }}
          >
            {t.clearHistory}
          </Button>
        </Box>
      </Box>

      {/* Delete Account */}
      <Box
        sx={{
          ...glassCardSx,
          border: `1px solid rgba(239, 68, 68, 0.3)`,
          mb: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ color: "#EF4444", fontWeight: 600 }}>{t.deleteAccount}</Typography>
            <Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}>
              {t.deleteWarning}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              borderRadius: glassBorderRadius.lg,
              borderColor: "#EF4444",
              color: "#EF4444",
              textTransform: "none",
              "&:hover": {
                borderColor: "#EF4444",
                background: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            {t.deleteAccount}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
