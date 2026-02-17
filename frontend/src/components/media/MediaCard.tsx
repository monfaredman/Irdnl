"use client";

import {
	Box,
	Card,
	CardContent,
	Chip,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { RatingBadge } from "@/components/interactive/RatingBadge";
import { WatchlistButton } from "@/components/interactive/WatchlistButton";
import type { Movie, Series } from "@/types/media";

interface MediaCardProps {
	item: Movie | Series;
	type: "movie" | "series";
}

export const MediaCard = ({ item, type }: MediaCardProps) => {
	const href = `/${type === "movie" ? "movies" : "series"}/${item.slug}`;
	const theme = useTheme();

	return (
		<Card
			component="article"
			sx={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				borderRadius: 4,
				height: "100%",
				transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
				"&:hover": {
					transform: "scale(1.02)",
					borderColor: theme.palette.primary.light,
					boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.3)`,
				},
			}}
		>
			<Box
				sx={{
					position: "relative",
					height: 256,
					width: "100%",
					overflow: "hidden",
					"&::after": {
						content: '""',
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)",
						opacity: 0,
						transition: "opacity 0.5s",
					},
					"&:hover::after": {
						opacity: 1,
					},
				}}
			>
				<Image
					src={item.poster}
					alt={item.title}
					fill
					style={{
						objectFit: "cover",
						transition: "all 0.7s",
					}}
					sizes="(max-width: 768px) 100vw, 20vw"
				/>
				<Box
					sx={{
						position: "absolute",
						left: 16,
						top: 16,
						zIndex: 10,
					}}
				>
					<RatingBadge rating={item.rating} />
				</Box>
				<Box
					sx={{
						position: "absolute",
						right: 16,
						top: 16,
						zIndex: 10,
					}}
				>
					<WatchlistButton
						mediaId={item.id}
						payload={{
							id: item.id,
							slug: item.slug,
							poster: item.poster,
							title: item.title,
							type,
						}}
					/>
				</Box>
			</Box>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					gap: 1.5,
					p: 2.5,
				}}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					sx={{ mb: 0.5 }}
				>
					<Chip
						label={item.year}
						size="small"
						sx={{
							background:
								theme.palette.glass?.light || "rgba(255, 255, 255, 0.03)",
							backdropFilter: "blur(10px)",
							border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.08)"}`,
							color: "rgba(255, 255, 255, 0.5)",
							fontSize: "0.75rem",
							height: 24,
							textTransform: "uppercase",
							letterSpacing: "0.05em",
						}}
					/>
					<Typography
						variant="caption"
						sx={{
							color: "rgba(255, 255, 255, 0.4)",
							fontSize: "0.75rem",
							textTransform: "uppercase",
							letterSpacing: "0.05em",
						}}
					>
						{item.genres.slice(0, 2).join(" · ")}
					</Typography>
				</Stack>
				<Typography
					component={Link}
					href={href}
					variant="h6"
					sx={{
						fontSize: "1.125rem",
						fontWeight: 600,
						color: "#fff",
						textDecoration: "none",
						transition: "color 0.2s",
						"&:hover": {
							color: theme.palette.primary.light,
						},
					}}
				>
					{item.title}
				</Typography>
				<Typography
					variant="body2"
					sx={{
						color: "rgba(255, 255, 255, 0.6)",
						fontSize: "0.875rem",
						lineHeight: 1.6,
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{item.description}
				</Typography>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					sx={{ mt: "auto", pt: 1 }}
				>
					{item.languages && item.languages.length > 0 && (
						<Chip
							label={item.languages.map((lng) => lng.toUpperCase()).join(" / ")}
							size="small"
							sx={{
								background:
									theme.palette.glass?.light || "rgba(255, 255, 255, 0.03)",
								backdropFilter: "blur(10px)",
								border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.08)"}`,
								color: "rgba(255, 255, 255, 0.5)",
								fontSize: "0.75rem",
								height: 24,
							}}
						/>
					)}
					{(!item.languages || item.languages.length === 0) && (
						<Box />
					)}
					<Typography
						variant="caption"
						sx={{
							color: "rgba(255, 255, 255, 0.4)",
							fontSize: "0.75rem",
						}}
					>
						{type === "series" ? (
							<>{(item as Series).seasons.length} seasons</>
						) : (
							<>{(item as Movie).duration} min</>
						)}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
};
