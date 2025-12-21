"use client";

import {
	ArrowBack,
	Bookmark,
	BookmarkBorder,
	Facebook,
	Instagram,
	Movie,
	Share,
	Twitter,
	Work,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	IconButton,
	Typography,
	Tabs,
	Tab,
	Alert,
} from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
	glassBorderRadius,
	glassColors,
	glassSpacing,
	glassBlur,
	glassAnimations,
	glassStyles,
} from "@/theme/glass-design-system";
import { useTMDBPerson } from "@/hooks/useTMDBPerson";
import { ShareDialog } from "@/components/modals/ShareDialog";
import { CastDetailSkeleton } from "@/components/media/CastDetailSkeleton";

export default function CastDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();

	// Extract numeric ID from slug (e.g., "12345-robert-downey-jr" -> 12345)
	const personId = id ? Number.parseInt(id.split("-")[0]) : null;

	const {
		details,
		credits,
		images,
		loading,
		error,
		getImageUrl,
		getKnownFor,
		getFilmography,
		getAge,
	} = useTMDBPerson(personId);

	const [isBookmarked, setIsBookmarked] = useState(false);
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [bioExpanded, setBioExpanded] = useState(false);
	const [selectedTab, setSelectedTab] = useState(0);
	const [mediaFilter, setMediaFilter] = useState<"all" | "movie" | "tv">("all");

	// Get known for works
	const knownForWorks = useMemo(() => getKnownFor(6), [getKnownFor]);

	// Get filtered filmography
	const filmography = useMemo(() => {
		const filter = mediaFilter === "all" ? undefined : mediaFilter;
		return getFilmography(filter);
	}, [getFilmography, mediaFilter]);

	// Calculate career stats
	const careerStats = useMemo(() => {
		if (!credits) return { movies: 0, tv: 0, total: 0 };
		return {
			movies: credits.cast.filter((c) => c.media_type === "movie").length,
			tv: credits.cast.filter((c) => c.media_type === "tv").length,
			total: credits.cast.length,
		};
	}, [getFilmography, mediaFilter]);

	if (loading) {
		return <CastDetailSkeleton />;
	}

	if (error || !details) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: glassColors.deepMidnight,
					pt: 20,
				}}
			>
				<Container maxWidth="lg">
					<Alert
						severity="error"
						sx={{
							...glassStyles.card,
							color: glassColors.text.primary,
						}}
					>
						{error?.message || "Cast member not found"}
					</Alert>
				</Container>
			</Box>
		);
	}

	const age = getAge();
	const profileImage = getImageUrl(details.profile_path, "h632");

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: glassColors.deepMidnight,
			}}
		>
			{/* Hero Section with Background */}
			<Box
				sx={{
					position: "relative",
					height: { xs: "70vh", md: "80vh" },
					overflow: "hidden",
				}}
			>
				{/* Background Image */}
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundImage: `url(${profileImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center top",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `linear-gradient(180deg, 
                transparent 0%, 
                ${glassColors.deepMidnight}40 50%,
                ${glassColors.deepMidnight} 100%)`,
						},
					}}
				/>

				{/* Back Button */}
				<Box
					sx={{
						position: "absolute",
						top: { xs: 80, md: 100 },
						left: { xs: 16, md: 32 },
						zIndex: 10,
					}}
				>
					<IconButton
						onClick={() => router.back()}
						sx={{
							...glassStyles.iconButton,
							width: 48,
							height: 48,
						}}
					>
						<ArrowBack />
					</IconButton>
				</Box>

				{/* Hero Content */}
				<Container
					maxWidth="lg"
					sx={{
						position: "relative",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
						pb: 8,
						zIndex: 2,
					}}
				>
					{/* Name and Title */}
					<Typography
						variant="h2"
						sx={{
							color: glassColors.white,
							fontWeight: 700,
							fontSize: { xs: "2rem", md: "3rem" },
							mb: 1,
							textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
						}}
					>
						{details.name}
					</Typography>

					{/* Known For Department */}
					<Typography
						variant="h6"
						sx={{
							color: glassColors.persianGold,
							fontSize: { xs: "1rem", md: "1.25rem" },
							mb: 3,
							textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
						}}
					>
						{details.known_for_department === "Acting"
							? "بازیگر"
							: details.known_for_department === "Directing"
								? "کارگردان"
								: details.known_for_department}
					</Typography>

					{/* Stats and Actions */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
							alignItems: "center",
						}}
					>
						{/* Vital Stats */}
						<Box
							sx={{
								...glassStyles.card,
								px: 3,
								py: 1.5,
								display: "flex",
								gap: 3,
								flexWrap: "wrap",
							}}
						>
							{details.birthday && (
								<Box>
									<Typography
										variant="caption"
										sx={{ color: glassColors.text.tertiary }}
									>
										متولد
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: glassColors.text.primary, fontWeight: 600 }}
									>
										{new Date(details.birthday).toLocaleDateString("fa-IR")}
										{age && ` (${age} سال)`}
									</Typography>
								</Box>
							)}
							{details.place_of_birth && (
								<Box>
									<Typography
										variant="caption"
										sx={{ color: glassColors.text.tertiary }}
									>
										محل تولد
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: glassColors.text.primary, fontWeight: 600 }}
									>
										{details.place_of_birth}
									</Typography>
								</Box>
							)}
							<Box>
								<Typography
									variant="caption"
									sx={{ color: glassColors.text.tertiary }}
								>
									محبوبیت
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: glassColors.persianGold, fontWeight: 600 }}
								>
									{details.popularity.toFixed(1)}
								</Typography>
							</Box>
						</Box>

						{/* Action Buttons */}
						<IconButton
							onClick={() => setIsBookmarked(!isBookmarked)}
							sx={{
								...glassStyles.iconButton,
								width: 48,
								height: 48,
							}}
						>
							{isBookmarked ? <Bookmark /> : <BookmarkBorder />}
						</IconButton>

						<IconButton
							onClick={() => setShareDialogOpen(true)}
							sx={{
								...glassStyles.iconButton,
								width: 48,
								height: 48,
							}}
						>
							<Share />
						</IconButton>

						{/* Social Links */}
						{details.external_ids?.instagram_id && (
							<IconButton
								component="a"
								href={`https://instagram.com/${details.external_ids.instagram_id}`}
								target="_blank"
								sx={{
									...glassStyles.iconButton,
									width: 48,
									height: 48,
								}}
							>
								<Instagram />
							</IconButton>
						)}
						{details.external_ids?.twitter_id && (
							<IconButton
								component="a"
								href={`https://twitter.com/${details.external_ids.twitter_id}`}
								target="_blank"
								sx={{
									...glassStyles.iconButton,
									width: 48,
									height: 48,
								}}
							>
								<Twitter />
							</IconButton>
						)}
						{details.external_ids?.facebook_id && (
							<IconButton
								component="a"
								href={`https://facebook.com/${details.external_ids.facebook_id}`}
								target="_blank"
								sx={{
									...glassStyles.iconButton,
									width: 48,
									height: 48,
								}}
							>
								<Facebook />
							</IconButton>
						)}
					</Box>
				</Container>
			</Box>

			<Container maxWidth="lg" sx={{ pb: 8 }}>
				{/* Biography Section */}
				{details.biography && (
					<Box
						sx={{
							...glassStyles.card,
							p: 4,
							mb: 4,
							mt: -4,
							position: "relative",
							zIndex: 3,
						}}
					>
						<Typography
							variant="h5"
							sx={{
								color: glassColors.white,
								fontWeight: 600,
								mb: 2,
							}}
						>
							بیوگرافی
						</Typography>

						<Box
							sx={{
								position: "relative",
								maxHeight: bioExpanded ? "none" : "200px",
								overflow: "hidden",
								"&::after": !bioExpanded
									? {
											content: '""',
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											height: "100px",
											background: `linear-gradient(180deg, transparent, ${glassColors.glass.strong})`,
										}
									: {},
							}}
						>
							<Typography
								variant="body1"
								sx={{
									color: glassColors.text.secondary,
									lineHeight: 1.8,
									whiteSpace: "pre-line",
								}}
							>
								{details.biography}
							</Typography>
						</Box>

						{details.biography.length > 300 && (
							<Button
								onClick={() => setBioExpanded(!bioExpanded)}
								sx={{
									...glassStyles.pillButton(false),
									mt: 2,
								}}
							>
								{bioExpanded ? "نمایش کمتر" : "ادامه مطلب"}
							</Button>
						)}

						{/* Also Known As */}
						{details.also_known_as.length > 0 && (
							<Box sx={{ mt: 3 }}>
								<Typography
									variant="subtitle2"
									sx={{
										color: glassColors.text.tertiary,
										mb: 1.5,
									}}
								>
									نام‌های دیگر:
								</Typography>
								<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
									{details.also_known_as.map((name, index) => (
										<Chip
											key={index}
											label={name}
											sx={{
												background: glassColors.glass.mid,
												border: `1px solid ${glassColors.glass.border}`,
												color: glassColors.text.secondary,
												fontSize: "0.875rem",
											}}
										/>
									))}
								</Box>
							</Box>
						)}
					</Box>
				)}

				{/* Known For Carousel */}
				{knownForWorks.length > 0 && (
					<Box sx={{ mb: 4 }}>
						<Typography
							variant="h5"
							sx={{
								color: glassColors.white,
								fontWeight: 600,
								mb: 3,
							}}
						>
							شناخته شده برای
						</Typography>
						<Box
							sx={{
								display: "flex",
								gap: 2,
								overflowX: "auto",
								pb: 2,
								"&::-webkit-scrollbar": {
									height: 8,
								},
								"&::-webkit-scrollbar-track": {
									background: glassColors.glass.base,
									borderRadius: glassBorderRadius.sm,
								},
								"&::-webkit-scrollbar-thumb": {
									background: glassColors.glass.border,
									borderRadius: glassBorderRadius.sm,
									"&:hover": {
										background: glassColors.glass.strong,
									},
								},
							}}
						>
							{knownForWorks.map((work) => (
								<Box
									key={`${work.media_type}-${work.id}`}
									component={Link}
									href={`/item/${work.id}`}
									sx={{
										...glassStyles.cardHover,
										minWidth: 150,
										flexShrink: 0,
										p: 0,
										overflow: "hidden",
										textDecoration: "none",
									}}
								>
									<Box
										sx={{
											width: 150,
											height: 225,
											backgroundImage: `url(${getImageUrl(work.poster_path, "w342")})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									/>
									<Box sx={{ p: 1.5 }}>
										<Typography
											variant="body2"
											sx={{
												color: glassColors.text.primary,
												fontWeight: 600,
												fontSize: "0.875rem",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{work.title || work.name}
										</Typography>
										{work.character && (
											<Typography
												variant="caption"
												sx={{
													color: glassColors.text.tertiary,
													display: "block",
												}}
											>
												{work.character}
											</Typography>
										)}
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				)}

				{/* Filmography Section */}
				{filmography.length > 0 && (
					<Box>
						<Typography
							variant="h5"
							sx={{
								color: glassColors.white,
								fontWeight: 600,
								mb: 2,
							}}
						>
							فیلم‌شناسی
						</Typography>

						{/* Filter Tabs */}
						<Tabs
							value={selectedTab}
							onChange={(_, newValue) => {
								setSelectedTab(newValue);
								setMediaFilter(newValue === 0 ? "all" : newValue === 1 ? "movie" : "tv");
							}}
							sx={{
								mb: 3,
								"& .MuiTabs-indicator": {
									background: `linear-gradient(90deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
									height: 3,
								},
							}}
						>
							<Tab
								label={`همه (${careerStats.total})`}
								sx={{
									...glassStyles.pillButton(selectedTab === 0),
									minWidth: "auto",
								}}
							/>
							<Tab
								label={`فیلم‌ها (${careerStats.movies})`}
								sx={{
									...glassStyles.pillButton(selectedTab === 1),
									minWidth: "auto",
								}}
							/>
							<Tab
								label={`سریال‌ها (${careerStats.tv})`}
								sx={{
									...glassStyles.pillButton(selectedTab === 2),
									minWidth: "auto",
								}}
							/>
						</Tabs>

						{/* Filmography Grid */}
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: "repeat(2, 1fr)",
									md: "repeat(3, 1fr)",
								},
								gap: 2,
							}}
						>
							{filmography.slice(0, 12).map((work) => {
								const year = work.release_date || work.first_air_date;
								const displayYear = year ? new Date(year).getFullYear() : "—";

								return (
									<Box
										key={`${work.media_type}-${work.id}`}
										component={Link}
										href={`/item/${work.id}`}
										sx={{
											...glassStyles.cardHover,
											p: 0,
											overflow: "hidden",
											textDecoration: "none",
											display: "flex",
											gap: 2,
										}}
									>
										<Box
											sx={{
												width: 80,
												height: 120,
												flexShrink: 0,
												backgroundImage: `url(${getImageUrl(work.poster_path, "w185")})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
												backgroundColor: glassColors.glass.base,
											}}
										/>
										<Box sx={{ py: 1.5, pr: 1.5, flex: 1 }}>
											<Typography
												variant="body2"
												sx={{
													color: glassColors.text.primary,
													fontWeight: 600,
													mb: 0.5,
													overflow: "hidden",
													textOverflow: "ellipsis",
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
												}}
											>
												{work.title || work.name}
											</Typography>
											<Typography
												variant="caption"
												sx={{
													color: glassColors.text.tertiary,
													display: "block",
													mb: 0.5,
												}}
											>
												{displayYear}
											</Typography>
											{work.character && (
												<Typography
													variant="caption"
													sx={{
														color: glassColors.persianGold,
														display: "block",
													}}
												>
													نقش: {work.character}
												</Typography>
											)}
											{work.vote_average > 0 && (
												<Typography
													variant="caption"
													sx={{
														color: glassColors.text.secondary,
														display: "block",
														mt: 0.5,
													}}
												>
													⭐ {work.vote_average.toFixed(1)}
												</Typography>
											)}
										</Box>
									</Box>
								);
							})}
						</Box>

						{filmography.length > 12 && (
							<Box sx={{ textAlign: "center", mt: 4 }}>
								<Button
									sx={{
										...glassStyles.pillButton(false),
										px: 4,
									}}
								>
									نمایش بیشتر
								</Button>
							</Box>
						)}
					</Box>
				)}

				{/* Gallery Section */}
				{images && images.profiles.length > 0 && (
					<Box sx={{ mt: 6 }}>
						<Typography
							variant="h5"
							sx={{
								color: glassColors.white,
								fontWeight: 600,
								mb: 3,
							}}
						>
							گالری تصاویر
						</Typography>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "repeat(2, 1fr)",
									sm: "repeat(3, 1fr)",
									md: "repeat(4, 1fr)",
								},
								gap: 2,
							}}
						>
							{images.profiles.slice(0, 8).map((image, index) => (
								<Box
									key={index}
									sx={{
										...glassStyles.cardHover,
										p: 0,
										overflow: "hidden",
										aspectRatio: "2/3",
										cursor: "pointer",
									}}
								>
									<Box
										sx={{
											width: "100%",
											height: "100%",
											backgroundImage: `url(${getImageUrl(image.file_path, "w342")})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									/>
								</Box>
							))}
						</Box>
					</Box>
				)}
			</Container>

			{/* Share Dialog */}
			<ShareDialog
				open={shareDialogOpen}
				onClose={() => setShareDialogOpen(false)}
				title={details.name}
			/>
		</Box>
	);
}
