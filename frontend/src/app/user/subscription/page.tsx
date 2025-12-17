"use client";

import CancelIcon from "@mui/icons-material/Cancel";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DevicesIcon from "@mui/icons-material/Devices";
import DownloadIcon from "@mui/icons-material/Download";
import Hd4kIcon from "@mui/icons-material/FourK";
import StarIcon from "@mui/icons-material/Star";
import {
	Box,
	Button,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		subscription: "Subscription",
		currentPlan: "Current Plan",
		choosePlan: "Choose Your Plan",
		monthly: "Monthly",
		yearly: "Yearly",
		save: "Save",
		perMonth: "/month",
		perYear: "/year",
		popular: "Most Popular",
		basic: "Basic",
		standard: "Standard",
		premium: "Premium",
		currentPlanLabel: "Current",
		subscribe: "Subscribe",
		upgrade: "Upgrade",
		downgrade: "Downgrade",
		cancelSub: "Cancel Subscription",
		renewsOn: "Renews on",
		features: {
			ads: "Ad-free viewing",
			quality720: "720p quality",
			quality1080: "1080p HD quality",
			quality4k: "4K Ultra HD quality",
			devices1: "Watch on 1 device",
			devices2: "Watch on 2 devices",
			devices4: "Watch on 4 devices",
			download: "Download content",
			downloadUnlimited: "Unlimited downloads",
			hdr: "HDR support",
			atmos: "Dolby Atmos",
			earlyAccess: "Early access to new releases",
		},
	},
	fa: {
		subscription: "اشتراک",
		currentPlan: "پلن فعلی",
		choosePlan: "پلن خود را انتخاب کنید",
		monthly: "ماهانه",
		yearly: "سالانه",
		save: "صرفه‌جویی",
		perMonth: "/ماه",
		perYear: "/سال",
		popular: "محبوب‌ترین",
		basic: "پایه",
		standard: "استاندارد",
		premium: "ویژه",
		currentPlanLabel: "فعلی",
		subscribe: "اشتراک",
		upgrade: "ارتقا",
		downgrade: "کاهش",
		cancelSub: "لغو اشتراک",
		renewsOn: "تمدید در",
		features: {
			ads: "بدون تبلیغات",
			quality720: "کیفیت 720p",
			quality1080: "کیفیت 1080p HD",
			quality4k: "کیفیت 4K Ultra HD",
			devices1: "پخش روی ۱ دستگاه",
			devices2: "پخش روی ۲ دستگاه",
			devices4: "پخش روی ۴ دستگاه",
			download: "دانلود محتوا",
			downloadUnlimited: "دانلود نامحدود",
			hdr: "پشتیبانی HDR",
			atmos: "Dolby Atmos",
			earlyAccess: "دسترسی زودهنگام",
		},
	},
};

const plans = [
	{
		id: "basic",
		nameKey: "basic" as const,
		monthlyPrice: 9.99,
		yearlyPrice: 99,
		features: ["ads", "quality720", "devices1"] as const,
		color: "#64748B",
	},
	{
		id: "standard",
		nameKey: "standard" as const,
		monthlyPrice: 14.99,
		yearlyPrice: 149,
		features: ["ads", "quality1080", "devices2", "download"] as const,
		color: "#3B82F6",
		popular: true,
	},
	{
		id: "premium",
		nameKey: "premium" as const,
		monthlyPrice: 19.99,
		yearlyPrice: 199,
		features: [
			"ads",
			"quality4k",
			"devices4",
			"downloadUnlimited",
			"hdr",
			"atmos",
			"earlyAccess",
		] as const,
		color: glassColors.persianGold,
	},
];

// Feature icon mapping
function FeatureIcon({ feature }: { feature: string }) {
	switch (feature) {
		case "devices1":
		case "devices2":
		case "devices4":
			return <DevicesIcon sx={{ fontSize: "1.2rem" }} />;
		case "download":
		case "downloadUnlimited":
			return <DownloadIcon sx={{ fontSize: "1.2rem" }} />;
		case "quality4k":
		case "hdr":
			return <Hd4kIcon sx={{ fontSize: "1.2rem" }} />;
		default:
			return <CheckCircleIcon sx={{ fontSize: "1.2rem" }} />;
	}
}

export default function SubscriptionPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;

	const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
		"monthly",
	);
	const currentPlan = "standard"; // Mock current plan

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
		p: 3,
		position: "relative",
		overflow: "hidden",
	};

	return (
		<Box>
			{/* Header */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
				<CardMembershipIcon
					sx={{ color: glassColors.persianGold, fontSize: "2rem" }}
				/>
				<Typography
					variant="h4"
					sx={{ color: glassColors.text.primary, fontWeight: 700 }}
				>
					{t.subscription}
				</Typography>
			</Box>

			{/* Billing Toggle */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					gap: 1,
					mb: 4,
					p: 0.5,
					background: glassColors.glass.base,
					borderRadius: glassBorderRadius.pill,
					width: "fit-content",
					mx: "auto",
				}}
			>
				<Button
					onClick={() => setBillingPeriod("monthly")}
					sx={{
						px: 3,
						py: 1,
						borderRadius: glassBorderRadius.pill,
						background:
							billingPeriod === "monthly"
								? glassColors.persianGold
								: "transparent",
						color:
							billingPeriod === "monthly" ? "#000" : glassColors.text.secondary,
						fontWeight: 600,
						textTransform: "none",
						"&:hover": {
							background:
								billingPeriod === "monthly"
									? glassColors.persianGold
									: glassColors.glass.mid,
						},
					}}
				>
					{t.monthly}
				</Button>
				<Button
					onClick={() => setBillingPeriod("yearly")}
					sx={{
						px: 3,
						py: 1,
						borderRadius: glassBorderRadius.pill,
						background:
							billingPeriod === "yearly"
								? glassColors.persianGold
								: "transparent",
						color:
							billingPeriod === "yearly" ? "#000" : glassColors.text.secondary,
						fontWeight: 600,
						textTransform: "none",
						"&:hover": {
							background:
								billingPeriod === "yearly"
									? glassColors.persianGold
									: glassColors.glass.mid,
						},
					}}
				>
					{t.yearly}
					<Chip
						label={`${t.save} 17%`}
						size="small"
						sx={{
							ml: 1,
							height: 20,
							fontSize: "0.7rem",
							background: "#22C55E",
							color: "#fff",
						}}
					/>
				</Button>
			</Box>

			{/* Plans Grid */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
					gap: 3,
				}}
			>
				{plans.map((plan) => {
					const isCurrentPlan = plan.id === currentPlan;
					const price =
						billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
					const priceLabel =
						billingPeriod === "monthly" ? t.perMonth : t.perYear;

					return (
						<Box
							key={plan.id}
							sx={{
								...glassCardSx,
								borderColor: isCurrentPlan
									? plan.color
									: glassColors.glass.border,
								borderWidth: isCurrentPlan ? 2 : 1,
								transform: plan.popular ? "scale(1.02)" : "none",
							}}
						>
							{/* Popular Badge */}
							{plan.popular && (
								<Box
									sx={{
										position: "absolute",
										top: 0,
										right: 0,
										background: `linear-gradient(135deg, ${plan.color}, ${plan.color}80)`,
										px: 2,
										py: 0.5,
										borderBottomLeftRadius: glassBorderRadius.lg,
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
										<StarIcon sx={{ fontSize: "0.9rem", color: "#fff" }} />
										<Typography
											sx={{
												color: "#fff",
												fontSize: "0.75rem",
												fontWeight: 600,
											}}
										>
											{t.popular}
										</Typography>
									</Box>
								</Box>
							)}

							{/* Plan Header */}
							<Typography
								variant="h5"
								sx={{
									color: plan.color,
									fontWeight: 700,
									mb: 1,
								}}
							>
								{t[plan.nameKey]}
							</Typography>

							{/* Price */}
							<Box sx={{ mb: 3 }}>
								<Typography
									component="span"
									sx={{
										fontSize: "2.5rem",
										fontWeight: 800,
										color: glassColors.text.primary,
									}}
								>
									${price}
								</Typography>
								<Typography
									component="span"
									sx={{ color: glassColors.text.tertiary, fontSize: "0.9rem" }}
								>
									{priceLabel}
								</Typography>
							</Box>

							{/* Features */}
							<List dense sx={{ mb: 3 }}>
								{plan.features.map((feature) => (
									<ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
										<ListItemIcon sx={{ minWidth: 32, color: plan.color }}>
											<FeatureIcon feature={feature} />
										</ListItemIcon>
										<ListItemText
											primary={t.features[feature]}
											primaryTypographyProps={{
												sx: {
													color: glassColors.text.secondary,
													fontSize: "0.9rem",
												},
											}}
										/>
									</ListItem>
								))}
							</List>

							{/* Action Button */}
							{isCurrentPlan ? (
								<Chip
									label={t.currentPlanLabel}
									sx={{
										width: "100%",
										py: 2,
										background: `${plan.color}20`,
										color: plan.color,
										fontWeight: 600,
										border: `1px solid ${plan.color}40`,
									}}
								/>
							) : (
								<Button
									fullWidth
									sx={{
										py: 1.5,
										borderRadius: glassBorderRadius.lg,
										background: plan.popular
											? `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`
											: "transparent",
										border: `1px solid ${plan.color}`,
										color: plan.popular ? "#fff" : plan.color,
										fontWeight: 600,
										textTransform: "none",
										"&:hover": {
											background: plan.popular
												? `linear-gradient(135deg, ${plan.color}CC, ${plan.color})`
												: `${plan.color}20`,
										},
									}}
								>
									{plans.findIndex((p) => p.id === plan.id) >
									plans.findIndex((p) => p.id === currentPlan)
										? t.upgrade
										: t.downgrade}
								</Button>
							)}
						</Box>
					);
				})}
			</Box>

			{/* Current Plan Info */}
			<Box
				sx={{
					...glassCardSx,
					mt: 4,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 2,
				}}
			>
				<Box>
					<Typography
						sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
					>
						{t.currentPlan}
					</Typography>
					<Typography sx={{ color: glassColors.text.primary, fontWeight: 600 }}>
						{t.standard} - $14.99{t.perMonth}
					</Typography>
					<Typography
						sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
					>
						{t.renewsOn}: March 15, 2025
					</Typography>
				</Box>
				<Button
					startIcon={<CancelIcon />}
					sx={{
						borderRadius: glassBorderRadius.lg,
						border: `1px solid rgba(239, 68, 68, 0.5)`,
						color: "#EF4444",
						textTransform: "none",
						"&:hover": {
							background: "rgba(239, 68, 68, 0.1)",
							borderColor: "#EF4444",
						},
					}}
				>
					{t.cancelSub}
				</Button>
			</Box>
		</Box>
	);
}
