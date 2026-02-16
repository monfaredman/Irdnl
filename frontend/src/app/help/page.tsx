"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DevicesIcon from "@mui/icons-material/Devices";
import DownloadIcon from "@mui/icons-material/Download";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import PaymentIcon from "@mui/icons-material/Payment";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	Box,
	Card,
	CardContent,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "Help Center",
		subtitle: "How can we help you today?",
		searchPlaceholder: "Search for help...",
		popularTopics: "Popular Topics",
		categories: {
			account: {
				title: "Account & Profile",
				description: "Manage your account settings, password, and profile",
				href: "/faq#account",
			},
			billing: {
				title: "Billing & Subscription",
				description: "Payment methods, subscription plans, and invoices",
				href: "/faq#billing",
			},
			streaming: {
				title: "Streaming & Playback",
				description: "Video quality, buffering issues, and playback",
				href: "/faq#streaming",
			},
			devices: {
				title: "Devices & Apps",
				description: "Supported devices and app installation",
				href: "/faq#devices",
			},
			downloads: {
				title: "Downloads",
				description: "Offline viewing and download management",
				href: "/faq#downloads",
			},
			settings: {
				title: "Settings & Preferences",
				description: "Language, subtitles, and app settings",
				href: "/faq#settings",
			},
		},
		contact: "Still need help?",
		contactText: "Our support team is available 24/7",
		contactButton: "Contact Support",
	},
	fa: {
		title: "راهنما",
		subtitle: "چگونه می‌توانیم به شما کمک کنیم؟",
		searchPlaceholder: "جستجوی راهنما...",
		popularTopics: "موضوعات پرطرفدار",
		categories: {
			account: {
				title: "حساب کاربری و پروفایل",
				description: "مدیریت تنظیمات حساب، رمز عبور و پروفایل",
				href: "/faq#account",
			},
			billing: {
				title: "صورتحساب و اشتراک",
				description: "روش‌های پرداخت، پلن‌های اشتراک و فاکتورها",
				href: "/faq#billing",
			},
			streaming: {
				title: "پخش و استریم",
				description: "کیفیت ویدیو، مشکلات بافرینگ و پخش",
				href: "/faq#streaming",
			},
			devices: {
				title: "دستگاه‌ها و اپلیکیشن‌ها",
				description: "دستگاه‌های پشتیبانی شده و نصب اپلیکیشن",
				href: "/faq#devices",
			},
			downloads: {
				title: "دانلود",
				description: "تماشای آفلاین و مدیریت دانلودها",
				href: "/faq#downloads",
			},
			settings: {
				title: "تنظیمات و ترجیحات",
				description: "زبان، زیرنویس و تنظیمات اپلیکیشن",
				href: "/faq#settings",
			},
		},
		contact: "هنوز به کمک نیاز دارید؟",
		contactText: "تیم پشتیبانی ما ۲۴/۷ در دسترس است",
		contactButton: "تماس با پشتیبانی",
	},
};

const categoryIcons = {
	account: AccountCircleIcon,
	billing: PaymentIcon,
	streaming: PlayCircleIcon,
	devices: DevicesIcon,
	downloads: DownloadIcon,
	settings: SettingsIcon,
};

export default function HelpPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;
	const [searchQuery, setSearchQuery] = useState("");

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
	};

	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			{/* Header */}
			<Box
				sx={{
					...glassCardSx,
					p: 4,
					mb: 4,
					textAlign: "center",
				}}
			>
				<Box
					sx={{
						width: 80,
						height: 80,
						borderRadius: "50%",
						background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mx: "auto",
						mb: 3,
					}}
				>
					<HelpCenterIcon sx={{ fontSize: "2.5rem", color: "#000" }} />
				</Box>
				<Typography
					variant="h3"
					sx={{ color: glassColors.text.primary, fontWeight: 800, mb: 1 }}
				>
					{t.title}
				</Typography>
				<Typography sx={{ color: glassColors.text.tertiary, mb: 4 }}>
					{t.subtitle}
				</Typography>

				{/* Search */}
				<TextField
					fullWidth
					placeholder={t.searchPlaceholder}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon sx={{ color: glassColors.text.tertiary }} />
							</InputAdornment>
						),
					}}
					sx={{
						maxWidth: 600,
						mx: "auto",
						"& .MuiOutlinedInput-root": {
							background: glassColors.glass.base,
							borderRadius: glassBorderRadius.xl,
							color: glassColors.text.primary,
							"& fieldset": { borderColor: glassColors.glass.border },
							"&:hover fieldset": {
								borderColor: `${glassColors.persianGold}60`,
							},
							"&.Mui-focused fieldset": {
								borderColor: glassColors.persianGold,
							},
						},
					}}
				/>
			</Box>

			{/* Categories */}
			<Typography
				variant="h5"
				sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
			>
				{t.popularTopics}
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{Object.entries(t.categories).map(([key, category]) => {
					const Icon = categoryIcons[key as keyof typeof categoryIcons];
					return (
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
							<Link href={category.href} style={{ textDecoration: "none" }}>
								<Card
									sx={{
										...glassCardSx,
										height: "100%",
										transition: "all 0.3s ease",
										cursor: "pointer",
										"&:hover": {
											borderColor: glassColors.persianGold,
											transform: "translateY(-4px)",
										},
									}}
								>
									<CardContent sx={{ p: 3 }}>
										<Icon
											sx={{
												fontSize: "2.5rem",
												color: glassColors.persianGold,
												mb: 2,
											}}
										/>
										<Typography
											variant="h6"
											sx={{
												color: glassColors.text.primary,
												fontWeight: 600,
												mb: 1,
											}}
										>
											{category.title}
										</Typography>
										<Typography
											sx={{
												color: glassColors.text.tertiary,
												fontSize: "0.9rem",
											}}
										>
											{category.description}
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
					);
				})}
			</Grid>

			{/* Contact Section */}
			<Box
				sx={{
					...glassCardSx,
					p: 4,
					textAlign: "center",
				}}
			>
				<Typography
					variant="h5"
					sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 1 }}
				>
					{t.contact}
				</Typography>
				<Typography sx={{ color: glassColors.text.tertiary, mb: 3 }}>
					{t.contactText}
				</Typography>
				<Link href="/contact" style={{ textDecoration: "none" }}>
					<Box
						component="span"
						sx={{
							display: "inline-block",
							px: 4,
							py: 1.5,
							borderRadius: glassBorderRadius.lg,
							background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
							color: "#000",
							fontWeight: 600,
							cursor: "pointer",
							transition: "all 0.3s ease",
							"&:hover": {
								transform: "translateY(-2px)",
								boxShadow: `0 8px 24px ${glassColors.persianGold}40`,
							},
						}}
					>
						{t.contactButton}
					</Box>
				</Link>
			</Box>
		</Box>
	);
}
