"use client";

import {
	BookmarkBorder,
	PlayArrow,
	Share,
	Star,
	ThumbDown,
	ThumbUp,
	OpenInNew,
} from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import type { Movie, Series } from "@/types/media";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
	glassStyles,
} from "@/theme/glass-design-system";

interface ItemHeaderProps {
	item: Movie | Series;
	type: "movie" | "series";
}

export function ItemHeader({ item, type }: ItemHeaderProps) {
	const handleShare = async () => {
		if (typeof window === "undefined") return;
		try {
			if (navigator.share) {
				await navigator.share({
					title: item.title,
					text: item.description,
					url: window.location.href,
				});
			} else {
				await navigator.clipboard.writeText(window.location.href);
			}
		} catch {
			// User canceled
		}
	};

	// Calculate satisfaction percentage from rating (0-10 scale to 0-100%)
	const satisfaction = Math.round((item.rating / 10) * 100);

	return (
		<Box
			sx={{
				...glassStyles.card,
				p: { xs: 3, md: 4 },
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Background gradient */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "200px",
					background: `linear-gradient(135deg, ${glassColors.gold.light}, transparent)`,
					opacity: 0.1,
					pointerEvents: "none",
				}}
			/>

			<Box sx={{ position: "relative", zIndex: 1 }}>
				{/* Persian Title */}
				<Typography
					variant="h3"
					sx={{
						color: glassColors.text.primary,
						fontWeight: 800,
						mb: 1,
						letterSpacing: "-0.02em",
						fontSize: { xs: "2rem", md: "2.5rem" },
					}}
					dir="rtl"
					lang="fa"
				>
					{item.title}
				</Typography>

				{/* English Title/Year Badge */}
				<Box
					sx={{
						display: "inline-flex",
						alignItems: "center",
						gap: 1,
						px: 2,
						py: 0.75,
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: glassBlur.light,
						WebkitBackdropFilter: glassBlur.light,
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.pill,
						mb: 2,
					}}
				>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.875rem",
							fontWeight: 500,
						}}
					>
						{item.title} {item.year}
					</Typography>
				</Box>

				{/* Genre Badges */}
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
					{item.genres.map((genre) => (
						<Chip
							key={genre}
							label={genre}
							sx={{
								...glassStyles.pillButton,
								fontSize: "0.875rem",
								height: 32,
								"&:hover": {
									background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
									border: `1px solid ${glassColors.persianGold}`,
								},
							}}
						/>
					))}
				</Box>

				{/* Metadata Row */}
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 2,
						mb: 3,
						pb: 3,
						borderBottom: `1px solid ${glassColors.glass.border}`,
					}}
				>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.9rem",
						}}
						dir="rtl"
					>
						{item.year}
					</Typography>
					<Typography sx={{ color: glassColors.text.muted }}>|</Typography>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.9rem",
						}}
						dir="rtl"
					>
						بالای ۱۳ سال
					</Typography>
					<Typography sx={{ color: glassColors.text.muted }}>|</Typography>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.9rem",
						}}
						dir="rtl"
					>
						{item.origin === "iranian" ? "ایران" : "خارجی"}
					</Typography>
					{type === "movie" && (item as Movie).duration && (
						<>
							<Typography sx={{ color: glassColors.text.muted }}>|</Typography>
							<Typography
								sx={{
									color: glassColors.text.secondary,
									fontSize: "0.9rem",
								}}
								dir="rtl"
							>
								{(item as Movie).duration} دقیقه
							</Typography>
						</>
					)}
				</Box>

				{/* Rating Section */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						gap: 3,
						mb: 3,
					}}
				>
					{/* Score */}
					<Box
						sx={{
							...glassStyles.card,
							p: 2,
							display: "flex",
							alignItems: "center",
							gap: 2,
							flex: 1,
						}}
					>
						<Star
							sx={{
								color: glassColors.persianGold,
								fontSize: "2rem",
							}}
						/>
						<Box>
							<Typography
								sx={{
									color: glassColors.text.primary,
									fontWeight: 700,
									fontSize: "1.5rem",
								}}
								dir="rtl"
							>
								{item.rating.toFixed(1)} از ۱۰
							</Typography>
							<Typography
								sx={{
									color: glassColors.text.secondary,
									fontSize: "0.875rem",
								}}
								dir="rtl"
							>
								از ۴۷ رای
							</Typography>
						</Box>
					</Box>

					{/* Satisfaction */}
					<Box
						sx={{
							...glassStyles.card,
							p: 2,
							display: "flex",
							alignItems: "center",
							gap: 2,
							flex: 1,
						}}
					>
						<Box
							sx={{
								position: "relative",
								width: 60,
								height: 60,
							}}
						>
							{/* Circular progress bar */}
							<svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
								<circle
									cx="30"
									cy="30"
									r="24"
									fill="none"
									stroke={glassColors.glass.border}
									strokeWidth="4"
								/>
								<circle
									cx="30"
									cy="30"
									r="24"
									fill="none"
									stroke={glassColors.persianGold}
									strokeWidth="4"
									strokeDasharray={`${(satisfaction / 100) * 150.8} 150.8`}
									strokeLinecap="round"
								/>
							</svg>
							<Typography
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									color: glassColors.text.primary,
									fontWeight: 700,
									fontSize: "0.875rem",
								}}
							>
								{satisfaction}%
							</Typography>
						</Box>
						<Typography
							sx={{
								color: glassColors.text.secondary,
								fontSize: "0.875rem",
							}}
							dir="rtl"
						>
							رضایت
						</Typography>
					</Box>
				</Box>

				{/* Cast & Director */}
				<Box sx={{ mb: 3 }}>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							mb: 1,
							fontSize: "0.875rem",
						}}
						dir="rtl"
					>
						<Box component="span" sx={{ color: glassColors.text.primary }}>
							بازیگران:
						</Box>{" "}
						{item.cast
							.filter((p) => p.role === "actor")
							.map((p) => p.name)
							.join("، ")}
					</Typography>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.875rem",
						}}
						dir="rtl"
					>
						<Box component="span" sx={{ color: glassColors.text.primary }}>
							کارگردان:
						</Box>{" "}
						{item.cast
							.filter((p) => p.role === "director")
							.map((p) => p.name)
							.join("، ")}
					</Typography>
				</Box>

				{/* Action Buttons */}
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
					<Button
						startIcon={<PlayArrow />}
						endIcon={item.externalPlayerUrl ? <OpenInNew sx={{ fontSize: "1rem !important" }} /> : undefined}
						onClick={() => {
							if (item.externalPlayerUrl) {
								window.open(item.externalPlayerUrl, "_blank", "noopener,noreferrer");
							}
						}}
						disabled={!item.externalPlayerUrl}
						sx={{
							...glassStyles.pillButton,
							px: 4,
							py: 1.5,
							fontSize: "1rem",
							fontWeight: 700,
							background: item.externalPlayerUrl
								? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
								: glassColors.glass.mid,
							border: `1px solid ${item.externalPlayerUrl ? glassColors.persianGold : glassColors.glass.border}`,
							color: glassColors.text.primary,
							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: `0 12px 32px -8px ${glassColors.gold.glow}`,
							},
							"&:disabled": {
								color: glassColors.text.muted,
								background: glassColors.glass.base,
								border: `1px solid ${glassColors.glass.border}`,
							},
						}}
					>
						{item.externalPlayerUrl ? "Watch Now" : "Not Available"}
					</Button>

					<IconButton
						sx={{
							...glassStyles.card,
							width: 48,
							height: 48,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								transform: "translateY(-2px) scale(1.05)",
								border: `1px solid ${glassColors.persianGold}40`,
							},
						}}
					>
						<ThumbUp sx={{ color: glassColors.text.secondary }} />
					</IconButton>

					<IconButton
						sx={{
							...glassStyles.card,
							width: 48,
							height: 48,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								transform: "translateY(-2px) scale(1.05)",
								border: `1px solid ${glassColors.persianGold}40`,
							},
						}}
					>
						<ThumbDown sx={{ color: glassColors.text.secondary }} />
					</IconButton>

					<IconButton
						onClick={handleShare}
						sx={{
							...glassStyles.card,
							width: 48,
							height: 48,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								transform: "translateY(-2px) scale(1.05)",
								border: `1px solid ${glassColors.persianGold}40`,
							},
						}}
					>
						<Share sx={{ color: glassColors.text.secondary }} />
					</IconButton>

					<IconButton
						sx={{
							...glassStyles.card,
							width: 48,
							height: 48,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								transform: "translateY(-2px) scale(1.05)",
								border: `1px solid ${glassColors.persianGold}40`,
							},
						}}
					>
						<BookmarkBorder sx={{ color: glassColors.text.secondary }} />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
}
