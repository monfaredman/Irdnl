"use client";

import InfoIcon from "@mui/icons-material/Info";
import MovieIcon from "@mui/icons-material/Movie";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";
import { Box, Grid, Typography } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "About Us",
		subtitle: "Your premium streaming destination",
		mission: "Our Mission",
		missionText:
			"To provide the best streaming experience with a vast library of movies and series from around the world, including Persian dubbed content and original Iranian productions.",
		stats: {
			movies: "Movies",
			series: "TV Series",
			users: "Active Users",
			countries: "Countries",
		},
		values: {
			title: "Our Values",
			quality: {
				title: "Quality Content",
				description:
					"We curate only the best movies and series, ensuring high-quality streaming in up to 4K resolution.",
			},
			accessibility: {
				title: "Accessibility",
				description:
					"Content available with Persian dubbing and subtitles, making entertainment accessible to all Persian speakers.",
			},
			innovation: {
				title: "Innovation",
				description:
					"Constantly improving our platform with the latest technology for the best user experience.",
			},
		},
		team: "Our Team",
		teamText:
			"A passionate team of movie lovers, engineers, and content curators working to bring you the best entertainment.",
	},
	fa: {
		title: "درباره ما",
		subtitle: "مقصد استریمینگ ویژه شما",
		mission: "ماموریت ما",
		missionText:
			"ارائه بهترین تجربه استریمینگ با کتابخانه گسترده‌ای از فیلم‌ها و سریال‌ها از سراسر جهان، شامل محتوای دوبله فارسی و تولیدات اصیل ایرانی.",
		stats: {
			movies: "فیلم",
			series: "سریال",
			users: "کاربر فعال",
			countries: "کشور",
		},
		values: {
			title: "ارزش‌های ما",
			quality: {
				title: "محتوای باکیفیت",
				description:
					"ما فقط بهترین فیلم‌ها و سریال‌ها را انتخاب می‌کنیم و استریمینگ باکیفیت تا 4K را تضمین می‌کنیم.",
			},
			accessibility: {
				title: "دسترسی‌پذیری",
				description:
					"محتوا با دوبله و زیرنویس فارسی در دسترس است تا سرگرمی برای همه فارسی‌زبانان قابل دسترس باشد.",
			},
			innovation: {
				title: "نوآوری",
				description:
					"به طور مداوم پلتفرم خود را با جدیدترین فناوری برای بهترین تجربه کاربری بهبود می‌دهیم.",
			},
		},
		team: "تیم ما",
		teamText:
			"تیمی از عاشقان سینما، مهندسان و متخصصان محتوا که برای ارائه بهترین سرگرمی به شما تلاش می‌کنند.",
	},
};

const stats = [
	{ key: "movies", value: "10,000+", icon: MovieIcon },
	{ key: "series", value: "2,500+", icon: MovieIcon },
	{ key: "users", value: "5M+", icon: PeopleIcon },
	{ key: "countries", value: "50+", icon: PublicIcon },
];

export default function AboutPage() {
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
					<InfoIcon sx={{ fontSize: "2rem", color: "#000" }} />
				</Box>
				<Box>
					<Typography
						variant="h3"
						sx={{ color: glassColors.text.primary, fontWeight: 800, mb: 0.5 }}
					>
						{t.title}
					</Typography>
					<Typography sx={{ color: glassColors.text.tertiary }}>
						{t.subtitle}
					</Typography>
				</Box>
			</Box>

			{/* Stats */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Grid size={{ xs: 6, md: 3 }} key={stat.key}>
							<Box sx={{ ...glassCardSx, textAlign: "center" }}>
								<Icon
									sx={{
										color: glassColors.persianGold,
										fontSize: "2.5rem",
										mb: 1,
									}}
								/>
								<Typography
									variant="h4"
									sx={{ color: glassColors.text.primary, fontWeight: 800 }}
								>
									{stat.value}
								</Typography>
								<Typography sx={{ color: glassColors.text.tertiary }}>
									{t.stats[stat.key as keyof typeof t.stats]}
								</Typography>
							</Box>
						</Grid>
					);
				})}
			</Grid>

			{/* Mission */}
			<Box sx={{ ...glassCardSx, mb: 4 }}>
				<Typography
					variant="h5"
					sx={{ color: glassColors.persianGold, fontWeight: 700, mb: 2 }}
				>
					{t.mission}
				</Typography>
				<Typography
					sx={{
						color: glassColors.text.secondary,
						fontSize: "1.1rem",
						lineHeight: 1.8,
					}}
				>
					{t.missionText}
				</Typography>
			</Box>

			{/* Values */}
			<Typography
				variant="h5"
				sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
			>
				{t.values.title}
			</Typography>
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{(["quality", "accessibility", "innovation"] as const).map((value) => (
					<Grid size={{ xs: 12, md: 4 }} key={value}>
						<Box sx={{ ...glassCardSx, height: "100%" }}>
							<StarIcon
								sx={{ color: glassColors.persianGold, fontSize: "2rem", mb: 2 }}
							/>
							<Typography
								variant="h6"
								sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 1 }}
							>
								{t.values[value].title}
							</Typography>
							<Typography sx={{ color: glassColors.text.tertiary }}>
								{t.values[value].description}
							</Typography>
						</Box>
					</Grid>
				))}
			</Grid>

			{/* Team */}
			<Box sx={glassCardSx}>
				<Typography
					variant="h5"
					sx={{ color: glassColors.persianGold, fontWeight: 700, mb: 2 }}
				>
					{t.team}
				</Typography>
				<Typography
					sx={{
						color: glassColors.text.secondary,
						fontSize: "1.1rem",
						lineHeight: 1.8,
					}}
				>
					{t.teamText}
				</Typography>
			</Box>
		</Box>
	);
}
