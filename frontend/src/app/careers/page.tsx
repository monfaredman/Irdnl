"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "Careers",
		subtitle: "Join our team and shape the future of streaming",
		whyJoin: "Why Join irdnl?",
		benefits: {
			growth: {
				title: "Career Growth",
				description: "Clear progression paths and learning opportunities",
			},
			culture: {
				title: "Great Culture",
				description: "Collaborative, inclusive, and fun work environment",
			},
			impact: {
				title: "Make Impact",
				description: "Your work reaches millions of users worldwide",
			},
		},
		openPositions: "Open Positions",
		viewDetails: "View Details",
		apply: "Apply Now",
		remote: "Remote",
		fullTime: "Full-time",
		partTime: "Part-time",
		noPositions: "No open positions at the moment. Check back soon!",
	},
	fa: {
		title: "فرصت‌های شغلی",
		subtitle: "به تیم ما بپیوندید و آینده استریمینگ را شکل دهید",
		whyJoin: "چرا ایران دانلود؟",
		benefits: {
			growth: {
				title: "رشد شغلی",
				description: "مسیرهای پیشرفت واضح و فرصت‌های یادگیری",
			},
			culture: {
				title: "فرهنگ عالی",
				description: "محیط کاری مشارکتی، فراگیر و سرگرم‌کننده",
			},
			impact: {
				title: "ایجاد تأثیر",
				description: "کار شما به میلیون‌ها کاربر در سراسر جهان می‌رسد",
			},
		},
		openPositions: "موقعیت‌های باز",
		viewDetails: "مشاهده جزئیات",
		apply: "درخواست",
		remote: "دورکاری",
		fullTime: "تمام‌وقت",
		partTime: "پاره‌وقت",
		noPositions: "در حال حاضر موقعیت بازی وجود ندارد. بعداً مراجعه کنید!",
	},
};

const jobs = [
	{
		id: 1,
		title: "Senior Frontend Developer",
		titleFa: "توسعه‌دهنده ارشد فرانت‌اند",
		department: "Engineering",
		departmentFa: "مهندسی",
		location: "Tehran / Remote",
		locationFa: "تهران / دورکاری",
		type: "fullTime",
		description:
			"Build beautiful, performant user interfaces with React and Next.js",
		descriptionFa:
			"ساخت رابط‌های کاربری زیبا و با کارایی بالا با React و Next.js",
	},
	{
		id: 2,
		title: "Backend Engineer",
		titleFa: "مهندس بک‌اند",
		department: "Engineering",
		departmentFa: "مهندسی",
		location: "Tehran / Remote",
		locationFa: "تهران / دورکاری",
		type: "fullTime",
		description: "Design and implement scalable APIs and microservices",
		descriptionFa: "طراحی و پیاده‌سازی APIها و میکروسرویس‌های مقیاس‌پذیر",
	},
	{
		id: 3,
		title: "UI/UX Designer",
		titleFa: "طراح UI/UX",
		department: "Design",
		departmentFa: "طراحی",
		location: "Remote",
		locationFa: "دورکاری",
		type: "fullTime",
		description: "Create intuitive and beautiful user experiences",
		descriptionFa: "ایجاد تجربه‌های کاربری شهودی و زیبا",
	},
	{
		id: 4,
		title: "Content Curator",
		titleFa: "مسئول محتوا",
		department: "Content",
		departmentFa: "محتوا",
		location: "Tehran",
		locationFa: "تهران",
		type: "fullTime",
		description: "Curate and manage our streaming content library",
		descriptionFa: "مدیریت و انتخاب کتابخانه محتوای استریمینگ",
	},
	{
		id: 5,
		title: "Customer Support Specialist",
		titleFa: "متخصص پشتیبانی مشتری",
		department: "Support",
		departmentFa: "پشتیبانی",
		location: "Remote",
		locationFa: "دورکاری",
		type: "partTime",
		description: "Help our users with their questions and issues",
		descriptionFa: "کمک به کاربران در پاسخ به سوالات و مشکلات",
	},
];

const benefitIcons = {
	growth: TrendingUpIcon,
	culture: GroupsIcon,
	impact: FavoriteIcon,
};

export default function CareersPage() {
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
					<WorkIcon sx={{ fontSize: "2rem", color: "#000" }} />
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

			{/* Benefits */}
			<Typography
				variant="h5"
				sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
			>
				{t.whyJoin}
			</Typography>
			<Grid container spacing={3} sx={{ mb: 5 }}>
				{Object.entries(t.benefits).map(([key, benefit]) => {
					const Icon = benefitIcons[key as keyof typeof benefitIcons];
					return (
						<Grid size={{ xs: 12, md: 4 }} key={key}>
							<Box sx={glassCardSx}>
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
									{benefit.title}
								</Typography>
								<Typography sx={{ color: glassColors.text.tertiary }}>
									{benefit.description}
								</Typography>
							</Box>
						</Grid>
					);
				})}
			</Grid>

			{/* Job Listings */}
			<Typography
				variant="h5"
				sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
			>
				{t.openPositions}
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{jobs.map((job) => (
					<Box
						key={job.id}
						sx={{
							...glassCardSx,
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							alignItems: { xs: "flex-start", md: "center" },
							justifyContent: "space-between",
							gap: 2,
							transition: "all 0.3s ease",
							"&:hover": {
								borderColor: glassColors.persianGold,
							},
						}}
					>
						<Box>
							<Typography
								variant="h6"
								sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 1 }}
							>
								{language === "fa" ? job.titleFa : job.title}
							</Typography>
							<Typography
								sx={{
									color: glassColors.text.tertiary,
									fontSize: "0.9rem",
									mb: 2,
								}}
							>
								{language === "fa" ? job.descriptionFa : job.description}
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
								<Chip
									icon={<WorkIcon sx={{ fontSize: "1rem !important" }} />}
									label={language === "fa" ? job.departmentFa : job.department}
									size="small"
									sx={{
										background: glassColors.glass.base,
										color: glassColors.text.secondary,
									}}
								/>
								<Chip
									icon={<LocationOnIcon sx={{ fontSize: "1rem !important" }} />}
									label={language === "fa" ? job.locationFa : job.location}
									size="small"
									sx={{
										background: glassColors.glass.base,
										color: glassColors.text.secondary,
									}}
								/>
								<Chip
									icon={<AccessTimeIcon sx={{ fontSize: "1rem !important" }} />}
									label={job.type === "fullTime" ? t.fullTime : t.partTime}
									size="small"
									sx={{
										background: `${glassColors.persianGold}20`,
										color: glassColors.persianGold,
									}}
								/>
							</Box>
						</Box>
						<Link
							href={`/careers/${job.id}`}
							style={{ textDecoration: "none" }}
						>
							<Button
								sx={{
									borderRadius: glassBorderRadius.lg,
									background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
									color: "#000",
									fontWeight: 600,
									textTransform: "none",
									px: 3,
									"&:hover": {
										background: `linear-gradient(135deg, ${glassColors.persianGold}CC, ${glassColors.persianGold})`,
									},
								}}
							>
								{t.apply}
							</Button>
						</Link>
					</Box>
				))}
			</Box>
		</Box>
	);
}
