/**
 * Kids Components
 * 
 * Reusable components for the kids section
 * Playful Premium Liquid Glass design with animations
 */

"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import TimerIcon from "@mui/icons-material/Timer";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
  glassAnimations,
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";
import type { AgeRange, KidsCategory, KidsCharacter, EducationalBadge } from "@/hooks/useKidsContent";
import type { Movie, Series } from "@/types/media";

// Persian number converter
function toPersianNumber(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

// ============================================================================
// Floating Animation Elements
// ============================================================================

export function FloatingElements() {
  const elements = ["⭐", "🌈", "🎈", "🎨", "🎵", "🦋", "🌸", "☁️"];

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {elements.map((emoji, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            fontSize: { xs: "1.5rem", md: "2rem" },
            opacity: 0.4,
            left: `${10 + index * 12}%`,
            top: `${20 + (index * 8) % 60}%`,
            animation: `float${index % 3} ${4 + index * 0.5}s ease-in-out infinite`,
            animationDelay: `${index * 0.3}s`,
            "@keyframes float0": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-20px) rotate(10deg)" },
            },
            "@keyframes float1": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-30px) rotate(-10deg)" },
            },
            "@keyframes float2": {
              "0%, 100%": { transform: "translateY(0) scale(1)" },
              "50%": { transform: "translateY(-25px) scale(1.1)" },
            },
          }}
        >
          {emoji}
        </Box>
      ))}
    </Box>
  );
}

// ============================================================================
// Age Selector Component
// ============================================================================

export interface AgeSelectorProps {
  selectedAge: AgeRange;
  onAgeChange: (age: AgeRange) => void;
  ageGroups?: { id: AgeRange; label: string; labelFa: string; icon: string; color: string }[];
}

const DEFAULT_AGE_GROUPS = [
  { id: "all" as const, label: "All Ages", labelFa: "همه سنین", icon: "🌟", color: "#F59E0B" },
  { id: "3-5" as const, label: "3-5 Years", labelFa: "۳-۵ سال", icon: "👶", color: "#F472B6" },
  { id: "6-9" as const, label: "6-9 Years", labelFa: "۶-۹ سال", icon: "🧒", color: "#60A5FA" },
  { id: "10-12" as const, label: "10-12 Years", labelFa: "۱۰-۱۲ سال", icon: "🧑", color: "#34D399" },
];

export function AgeSelector({
  selectedAge,
  onAgeChange,
  ageGroups,
}: AgeSelectorProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  const groups = ageGroups ?? DEFAULT_AGE_GROUPS;

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {groups.map((group) => (
        <Button
          key={group.id}
          onClick={() => onAgeChange(group.id)}
          sx={{
            width: { xs: "calc(50% - 8px)", sm: 140 },
            height: 120,
            borderRadius: glassBorderRadius.xl,
            background:
              selectedAge === group.id
                ? `linear-gradient(135deg, ${group.color}, ${group.color}CC)`
                : "rgba(255,255,255,0.1)",
            border: `3px solid ${selectedAge === group.id ? group.color : "rgba(255,255,255,0.2)"}`,
            flexDirection: "column",
            gap: 1,
            transition: glassAnimations.transition.spring,
            transform: selectedAge === group.id ? "scale(1.05)" : "scale(1)",
            boxShadow: selectedAge === group.id ? `0 8px 32px ${group.color}40` : "none",
            "&:hover": {
              background: `linear-gradient(135deg, ${group.color}CC, ${group.color}99)`,
              transform: "scale(1.05)",
              borderColor: group.color,
            },
          }}
        >
          <Typography sx={{ fontSize: "2.5rem" }}>{group.icon}</Typography>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
            {isRTL ? group.labelFa : group.label}
          </Typography>
        </Button>
      ))}
    </Box>
  );
}

// ============================================================================
// Kids Category Card Component
// ============================================================================

export interface KidsCategoryCardProps {
  category: KidsCategory;
  icon?: React.ReactNode;
}

export function KidsCategoryCard({ category, icon }: KidsCategoryCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/category/kids/${category.id}`} style={{ textDecoration: "none" }}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          height: 160,
          borderRadius: glassBorderRadius.xl,
          background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`,
          border: `2px solid ${category.color}60`,
          overflow: "hidden",
          cursor: "pointer",
          transition: glassAnimations.transition.spring,
          transform: isHovered ? "scale(1.05) rotate(1deg)" : "scale(1)",
          "&:hover": {
            boxShadow: `0 12px 40px ${category.color}40`,
            borderColor: category.color,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 20px ${category.color}50`,
              color: "#fff",
              fontSize: "1.8rem",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
            }}
          >
            {icon || category.icon}
          </Box>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {isRTL ? category.nameFa : category.nameEn}
          </Typography>
        </Box>

        {/* Decorative corner */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${category.color}30, transparent 70%)`,
          }}
        />
      </Box>
    </Link>
  );
}

// ============================================================================
// Character Card Component
// ============================================================================

export interface CharacterCardProps {
  character: KidsCharacter;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        transition: glassAnimations.transition.spring,
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
    >
      <Avatar
        src={character.image}
        sx={{
          width: 90,
          height: 90,
          border: `4px solid ${character.color}`,
          boxShadow: `0 8px 24px ${character.color}40`,
          transition: "all 0.3s ease",
          ...(isHovered && {
            boxShadow: `0 12px 40px ${character.color}60`,
          }),
        }}
      />
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 600,
          textAlign: "center",
          fontSize: "0.9rem",
        }}
      >
        {isRTL ? character.nameFa : character.name}
      </Typography>
      <Typography
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.75rem",
          textAlign: "center",
        }}
      >
        {character.franchise}
      </Typography>
    </Box>
  );
}

// ============================================================================
// Kids Content Card Component
// ============================================================================

export interface KidsContentCardProps {
  item: Movie | Series;
  type: "movie" | "series";
  badge?: EducationalBadge;
}

export function KidsContentCard({ item, type, badge }: KidsContentCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const [isHovered, setIsHovered] = useState(false);

  const duration = type === "movie" ? (item as Movie).duration || 90 : 25;
  const durationLabel =
    duration <= 20
      ? { en: "Short (15 min)", fa: "کوتاه (۱۵ دقیقه)" }
      : duration <= 60
        ? { en: "Medium (30-60 min)", fa: "متوسط (۳۰-۶۰ دقیقه)" }
        : { en: "Long (90 min)", fa: "بلند (۹۰ دقیقه)" };

  const colorHue = item.title.charCodeAt(0) * 3 % 360;
  const cardColor = `hsl(${colorHue}, 70%, 60%)`;

  return (
    <Link href={`/item/${item.id}`} style={{ textDecoration: "none" }}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          borderRadius: glassBorderRadius.xxl,
          overflow: "hidden",
          background: "rgba(255,255,255,0.1)",
          border: "2px solid rgba(255,255,255,0.2)",
          transition: glassAnimations.transition.spring,
          transform: isHovered ? "translateY(-8px) scale(1.02)" : "scale(1)",
          "&:hover": {
            boxShadow: `0 16px 48px ${cardColor}30`,
            borderColor: cardColor,
          },
        }}
      >
        {/* Poster */}
        <Box sx={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}>
          <Image
            src={item.poster}
            alt={item.title}
            fill
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          />

          {/* Play Button Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${cardColor}70`,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <PlayArrowIcon sx={{ fontSize: "2.5rem", color: cardColor }} />
            </Box>
          </Box>

          {/* Rating Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: glassBlur.light,
              borderRadius: glassBorderRadius.md,
              px: 1.5,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <StarIcon sx={{ fontSize: "1rem", color: "#FACC15" }} />
            <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>
              {isRTL ? toPersianNumber(item.rating) : item.rating}
            </Typography>
          </Box>

          {/* Educational Badge */}
          {badge && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                background: `${badge.color}CC`,
                borderRadius: glassBorderRadius.md,
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 600 }}>
                {isRTL ? badge.labelFa : badge.labelEn}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Info */}
        <Box sx={{ p: 2 }}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </Typography>

          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: "0.8rem" }} />}
            label={isRTL ? durationLabel.fa : durationLabel.en}
            size="small"
            sx={{
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.7rem",
              height: 24,
              "& .MuiChip-icon": { color: "rgba(255,255,255,0.8)" },
            }}
          />
        </Box>
      </Box>
    </Link>
  );
}

// ============================================================================
// Parental Controls Panel Component
// ============================================================================

export interface ParentalControlsPanelProps {
  onSettingsChange?: (settings: {
    watchTime: number;
    educationalOnly: boolean;
    dubOnly: boolean;
    kidsModeEnabled: boolean;
  }) => void;
}

export function ParentalControlsPanel({ onSettingsChange }: ParentalControlsPanelProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  const [watchTime, setWatchTime] = useState<number>(1);
  const [educationalOnly, setEducationalOnly] = useState(false);
  const [dubOnly, setDubOnly] = useState(true);
  const [kidsModeEnabled, setKidsModeEnabled] = useState(true);

  const t = {
    title: language === "fa" ? "کنترل والدین" : "Parental Controls",
    watchTime: language === "fa" ? "حداکثر زمان تماشا" : "Max Watch Time",
    hours: language === "fa" ? "ساعت" : "hours",
    educationalOnly: language === "fa" ? "فقط محتوای آموزشی" : "Educational Only",
    dubOnly: language === "fa" ? "فقط دوبله فارسی" : "Persian Dubbed Only",
    enableKidsMode: language === "fa" ? "فعال کردن حالت کودک" : "Enable Kids Mode",
    exitKidsMode: language === "fa" ? "خروج از حالت کودک" : "Exit Kids Mode",
  };

  const handleChange = () => {
    onSettingsChange?.({
      watchTime,
      educationalOnly,
      dubOnly,
      kidsModeEnabled,
    });
  };

  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: glassBlur.medium,
        borderRadius: glassBorderRadius.xxl,
        border: "2px solid rgba(255,255,255,0.15)",
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: glassBorderRadius.lg,
            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SettingsIcon sx={{ color: "#fff" }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
          {t.title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Watch Time Slider */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ px: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TimerIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
              <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                {t.watchTime}: {isRTL ? toPersianNumber(watchTime) : watchTime} {t.hours}
              </Typography>
            </Box>
            <Slider
              value={watchTime}
              onChange={(_, value) => {
                setWatchTime(value as number);
                handleChange();
              }}
              min={0.5}
              max={4}
              step={0.5}
              marks
              sx={{
                color: "#8B5CF6",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#fff",
                  border: "2px solid #8B5CF6",
                },
                "& .MuiSlider-track": {
                  background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
                },
              }}
            />
          </Box>
        </Grid>

        {/* Toggles */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={educationalOnly}
                  onChange={(e) => {
                    setEducationalOnly(e.target.checked);
                    handleChange();
                  }}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#22C55E" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#22C55E",
                    },
                  }}
                />
              }
              label={t.educationalOnly}
              sx={{ color: "rgba(255,255,255,0.9)" }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={dubOnly}
                  onChange={(e) => {
                    setDubOnly(e.target.checked);
                    handleChange();
                  }}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#3B82F6" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#3B82F6",
                    },
                  }}
                />
              }
              label={t.dubOnly}
              sx={{ color: "rgba(255,255,255,0.9)" }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Kids Mode Toggle */}
      <Box
        sx={{
          mt: 3,
          pt: 3,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={kidsModeEnabled}
              onChange={(e) => {
                setKidsModeEnabled(e.target.checked);
                handleChange();
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#F59E0B" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#F59E0B",
                },
              }}
            />
          }
          label={t.enableKidsMode}
          sx={{ color: "#fff", fontWeight: 600 }}
        />

        <Button
          startIcon={<LockIcon />}
          sx={{
            borderRadius: glassBorderRadius.lg,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            textTransform: "none",
            px: 3,
            "&:hover": {
              background: "rgba(255,255,255,0.2)",
            },
          }}
        >
          {t.exitKidsMode}
        </Button>
      </Box>
    </Box>
  );
}

// ============================================================================
// Kids Hero Section Component
// ============================================================================

export interface KidsHeroProps {
  title?: string;
  subtitle?: string;
  showFloatingElements?: boolean;
  showExitButton?: boolean;
  onExit?: () => void;
}

export function KidsHero({
  title,
  subtitle,
  showFloatingElements = true,
  showExitButton = true,
  onExit,
}: KidsHeroProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  const t = {
    title: title || (language === "fa" ? "جهان شاد کودکان" : "Kids' Happy World"),
    subtitle: subtitle || (language === "fa" ? "محتوای امن و سرگرم‌کننده برای کودکان" : "Safe and fun content for children"),
    exitKidsMode: language === "fa" ? "خروج از حالت کودک" : "Exit Kids Mode",
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: glassBorderRadius.xxl,
        overflow: "hidden",
        p: { xs: 4, md: 6 },
        background: `linear-gradient(135deg, 
          rgba(147, 51, 234, 0.3) 0%, 
          rgba(236, 72, 153, 0.2) 50%, 
          rgba(59, 130, 246, 0.2) 100%)`,
        backdropFilter: glassBlur.medium,
        border: "2px solid rgba(255,255,255,0.2)",
      }}
    >
      {showFloatingElements && <FloatingElements />}

      <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 3 }}>
        <Box
          sx={{
            width: { xs: 72, md: 88 },
            height: { xs: 72, md: 88 },
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FACC15, #F472B6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(250, 204, 21, 0.4)",
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        >
          <ChildCareIcon sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, color: "#fff" }} />
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 0.5,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            {t.title}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: { xs: "0.9rem", md: "1.1rem" },
            }}
          >
            {t.subtitle}
          </Typography>
        </Box>
      </Box>

      {showExitButton && (
        <Button
          onClick={onExit}
          startIcon={<LockIcon />}
          sx={{
            position: "absolute",
            top: { xs: 16, md: 24 },
            right: isRTL ? "auto" : { xs: 16, md: 24 },
            left: isRTL ? { xs: 16, md: 24 } : "auto",
            borderRadius: glassBorderRadius.lg,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            textTransform: "none",
            px: 2,
            "&:hover": {
              background: "rgba(255,255,255,0.25)",
            },
          }}
        >
          {t.exitKidsMode}
        </Button>
      )}
    </Box>
  );
}

export default {
  FloatingElements,
  AgeSelector,
  KidsCategoryCard,
  CharacterCard,
  KidsContentCard,
  ParentalControlsPanel,
  KidsHero,
};
