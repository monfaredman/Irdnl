"use client";

import ChildCareIcon from "@mui/icons-material/ChildCare";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { glassBlur, glassBorderRadius } from "@/theme/glass-design-system";

const translations = {
	en: {
		title: "Kids Zone",
		subtitle: "Safe and fun content for children",
		ageGroups: "Age Groups",
		characters: "Favorite Characters",
		featuredShows: "Featured Shows",
		watchNow: "Watch Now",
		episodes: "episodes",
		exitKidsMode: "Exit Kids Mode",
		parentalLock: "Enter PIN to exit",
		allAges: "All Ages",
		years: "Years",
	},
	fa: {
		title: "بخش کودکان",
		subtitle: "محتوای امن و سرگرم‌کننده برای کودکان",
		ageGroups: "گروه‌های سنی",
		characters: "شخصیت‌های محبوب",
		featuredShows: "برنامه‌های ویژه",
		watchNow: "تماشا",
		episodes: "قسمت",
		exitKidsMode: "خروج از حالت کودک",
		parentalLock: "برای خروج PIN وارد کنید",
		allAges: "همه سنین",
		years: "سال",
	},
};

const ageGroups = [
	{ id: "0-2", label: "0-2", color: "#F472B6", icon: "👶" },
	{ id: "3-5", label: "3-5", color: "#A78BFA", icon: "🧒" },
	{ id: "6-8", label: "6-8", color: "#60A5FA", icon: "👦" },
	{ id: "9-12", label: "9-12", color: "#34D399", icon: "🧑" },
];

const characters = [
	{
		id: "mickey",
		name: "Mickey Mouse",
		image: "/images/avatars/avatar-1.jpg",
		color: "#EF4444",
	},
	{
		id: "elsa",
		name: "Elsa",
		image: "/images/avatars/avatar-2.jpg",
		color: "#3B82F6",
	},
	{
		id: "spidey",
		name: "Spidey",
		image: "/images/avatars/avatar-3.jpg",
		color: "#DC2626",
	},
	{
		id: "dora",
		name: "Dora",
		image: "/images/avatars/avatar-4.jpg",
		color: "#EC4899",
	},
	{
		id: "paw",
		name: "Paw Patrol",
		image: "/images/avatars/avatar-1.jpg",
		color: "#2563EB",
	},
	{
		id: "peppa",
		name: "Peppa Pig",
		image: "/images/avatars/avatar-2.jpg",
		color: "#F472B6",
	},
];

const kidsShows = [
	{
		id: "1",
		title: "Bluey",
		titleFa: "بلویی",
		poster: "/images/series/series-1.jpg",
		episodes: 154,
		rating: 9.5,
		color: "#60A5FA",
	},
	{
		id: "2",
		title: "CoComelon",
		titleFa: "کوکوملون",
		poster: "/images/series/series-2.jpg",
		episodes: 320,
		rating: 8.2,
		color: "#34D399",
	},
	{
		id: "3",
		title: "Paw Patrol",
		titleFa: "سگ‌های نگهبان",
		poster: "/images/series/series-3.jpg",
		episodes: 180,
		rating: 8.7,
		color: "#2563EB",
	},
	{
		id: "4",
		title: "Peppa Pig",
		titleFa: "پپا پیگ",
		poster: "/images/series/series-1.jpg",
		episodes: 260,
		rating: 8.5,
		color: "#F472B6",
	},
	{
		id: "5",
		title: "Frozen",
		titleFa: "یخ‌زده",
		poster: "/images/movies/movie-poster.jpg",
		episodes: 2,
		rating: 9.0,
		color: "#06B6D4",
	},
	{
		id: "6",
		title: "Toy Story",
		titleFa: "داستان اسباب‌بازی",
		poster: "/images/movies/movie-poster.jpg",
		episodes: 4,
		rating: 9.2,
		color: "#FACC15",
	},
];

export default function KidsPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;
	const [selectedAge, setSelectedAge] = useState<string | null>(null);

	// Kids-friendly glass styles with more color
	const kidsGlassCardSx = {
		background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `2px solid rgba(255,255,255,0.2)`,
		borderRadius: glassBorderRadius.xxl,
		overflow: "hidden",
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				py: 4,
				background: `linear-gradient(180deg, 
          rgba(147, 51, 234, 0.3) 0%, 
          rgba(59, 130, 246, 0.2) 50%, 
          rgba(16, 185, 129, 0.2) 100%)`,
			}}
		>
			{/* Header */}
			<Box
				sx={{
					...kidsGlassCardSx,
					p: 4,
					mb: 4,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
					<Box
						sx={{
							width: 72,
							height: 72,
							borderRadius: "50%",
							background: "linear-gradient(135deg, #FACC15, #F472B6)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 8px 32px rgba(250, 204, 21, 0.3)",
						}}
					>
						<ChildCareIcon sx={{ fontSize: "2.5rem", color: "#fff" }} />
					</Box>
					<Box>
						<Typography
							variant="h3"
							sx={{
								color: "#fff",
								fontWeight: 800,
								mb: 0.5,
								textShadow: "0 2px 8px rgba(0,0,0,0.2)",
							}}
						>
							{t.title}
						</Typography>
						<Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
							{t.subtitle}
						</Typography>
					</Box>
				</Box>

				<Button
					startIcon={<LockIcon />}
					sx={{
						borderRadius: glassBorderRadius.lg,
						background: "rgba(255,255,255,0.1)",
						border: "1px solid rgba(255,255,255,0.3)",
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

			{/* Age Groups */}
			<Box sx={{ mb: 5 }}>
				<Typography
					variant="h5"
					sx={{
						color: "#fff",
						fontWeight: 700,
						mb: 3,
						textShadow: "0 2px 8px rgba(0,0,0,0.2)",
					}}
				>
					{t.ageGroups}
				</Typography>
				<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
					{ageGroups.map((group) => (
						<Button
							key={group.id}
							onClick={() =>
								setSelectedAge(selectedAge === group.id ? null : group.id)
							}
							sx={{
								width: { xs: "calc(50% - 8px)", sm: 120 },
								height: 120,
								borderRadius: glassBorderRadius.xl,
								background:
									selectedAge === group.id
										? `linear-gradient(135deg, ${group.color}, ${group.color}CC)`
										: "rgba(255,255,255,0.1)",
								border: `2px solid ${selectedAge === group.id ? group.color : "rgba(255,255,255,0.2)"}`,
								flexDirection: "column",
								gap: 1,
								transition: "all 0.3s ease",
								transform:
									selectedAge === group.id ? "scale(1.05)" : "scale(1)",
								"&:hover": {
									background: `linear-gradient(135deg, ${group.color}CC, ${group.color}99)`,
									transform: "scale(1.05)",
								},
							}}
						>
							<Typography sx={{ fontSize: "2rem" }}>{group.icon}</Typography>
							<Typography
								sx={{
									color: "#fff",
									fontWeight: 700,
									fontSize: "1.1rem",
								}}
							>
								{group.label} {t.years}
							</Typography>
						</Button>
					))}
				</Box>
			</Box>

			{/* Favorite Characters */}
			<Box sx={{ mb: 5 }}>
				<Typography
					variant="h5"
					sx={{
						color: "#fff",
						fontWeight: 700,
						mb: 3,
						textShadow: "0 2px 8px rgba(0,0,0,0.2)",
					}}
				>
					{t.characters}
				</Typography>
				<Box
					sx={{
						display: "flex",
						gap: 3,
						overflowX: "auto",
						pb: 2,
						"&::-webkit-scrollbar": { display: "none" },
					}}
				>
					{characters.map((character) => (
						<Link
							key={character.id}
							href={`/kids/character/${character.id}`}
							style={{ textDecoration: "none" }}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 1.5,
									cursor: "pointer",
									transition: "transform 0.3s ease",
									"&:hover": { transform: "scale(1.1)" },
								}}
							>
								<Avatar
									src={character.image}
									sx={{
										width: 80,
										height: 80,
										border: `4px solid ${character.color}`,
										boxShadow: `0 8px 24px ${character.color}40`,
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
									{character.name}
								</Typography>
							</Box>
						</Link>
					))}
				</Box>
			</Box>

			{/* Featured Shows */}
			<Box>
				<Typography
					variant="h5"
					sx={{
						color: "#fff",
						fontWeight: 700,
						mb: 3,
						textShadow: "0 2px 8px rgba(0,0,0,0.2)",
					}}
				>
					{t.featuredShows}
				</Typography>
				<Grid container spacing={3}>
					{kidsShows.map((show) => (
						<Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={show.id}>
							<Link
								href={`/kids/watch/${show.id}`}
								style={{ textDecoration: "none" }}
							>
								<Box
									sx={{
										...kidsGlassCardSx,
										transition: "all 0.3s ease",
										"&:hover": {
											transform: "translateY(-8px) scale(1.02)",
											boxShadow: `0 12px 40px ${show.color}40`,
										},
									}}
								>
									{/* Poster */}
									<Box
										sx={{
											position: "relative",
											aspectRatio: "2/3",
											overflow: "hidden",
										}}
									>
										<Image
											src={show.poster}
											alt={language === "fa" ? show.titleFa : show.title}
											fill
											style={{ objectFit: "cover" }}
										/>
										{/* Play Button Overlay */}
										<Box
											sx={{
												position: "absolute",
												inset: 0,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												background: `${show.color}60`,
												opacity: 0,
												transition: "opacity 0.3s ease",
												"&:hover": { opacity: 1 },
											}}
										>
											<Box
												sx={{
													width: 56,
													height: 56,
													borderRadius: "50%",
													background: "#fff",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<PlayArrowIcon
													sx={{ fontSize: "2rem", color: show.color }}
												/>
											</Box>
										</Box>
										{/* Rating Badge */}
										<Box
											sx={{
												position: "absolute",
												top: 8,
												right: 8,
												background: "rgba(0,0,0,0.6)",
												borderRadius: glassBorderRadius.sm,
												px: 1,
												py: 0.25,
												display: "flex",
												alignItems: "center",
												gap: 0.5,
											}}
										>
											<StarIcon sx={{ fontSize: "0.9rem", color: "#FACC15" }} />
											<Typography
												sx={{
													color: "#fff",
													fontSize: "0.8rem",
													fontWeight: 600,
												}}
											>
												{show.rating}
											</Typography>
										</Box>
									</Box>

									{/* Info */}
									<Box sx={{ p: 2 }}>
										<Typography
											sx={{
												color: "#fff",
												fontWeight: 700,
												fontSize: "0.95rem",
												mb: 0.5,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{language === "fa" ? show.titleFa : show.title}
										</Typography>
										<Typography
											sx={{
												color: "rgba(255,255,255,0.6)",
												fontSize: "0.8rem",
											}}
										>
											{show.episodes} {t.episodes}
										</Typography>
									</Box>
								</Box>
							</Link>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
}
