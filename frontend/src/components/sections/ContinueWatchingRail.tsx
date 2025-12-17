"use client";

import {
	Box,
	Card,
	CardContent,
	LinearProgress,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import Link from "next/link";
import { movies, series } from "@/data/mockContent";
import { useContinueWatching } from "@/hooks/useContentStore";

const findMedia = (mediaId: string) =>
	movies.find((movie) => movie.id === mediaId) ??
	series.find((entry) => entry.id === mediaId);

export const ContinueWatchingRail = () => {
	const items = useContinueWatching();
	const theme = useTheme();

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.06)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.12)"}`,
		boxShadow:
			"0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
	};

	const glassSubtleStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.03)",
		backdropFilter: "blur(10px) saturate(180%)",
		WebkitBackdropFilter: "blur(10px) saturate(180%)",
		border: `1px dashed ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.2)"}`,
	};

	if (!items.length) {
		return (
			<Box
				sx={{
					...glassSubtleStyle,
					borderRadius: 4,
					p: 3,
					textAlign: "center",
				}}
			>
				<Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
					Start playing a movie or series to see your progress here.
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "flex",
				gap: 2,
				overflowX: "auto",
				pb: 1,
				"&::-webkit-scrollbar": {
					height: "8px",
				},
				"&::-webkit-scrollbar-track": {
					background: "transparent",
				},
				"&::-webkit-scrollbar-thumb": {
					background: "rgba(255, 255, 255, 0.2)",
					borderRadius: "4px",
				},
			}}
		>
			{items.map((entry) => {
				const percent = Math.round((entry.progress / entry.duration) * 100);
				const media = findMedia(entry.mediaId);
				if (!media) return null;
				const href = `${"seasons" in media ? "/series" : "/movies"}/${media.slug}`;
				return (
					<Card
						key={`${entry.mediaId}-${entry.episodeId ?? "movie"}`}
						component={Link}
						href={href}
						sx={{
							...glassStyle,
							position: "relative",
							minWidth: 240,
							borderRadius: 3,
							p: 2,
							textDecoration: "none",
							transition: "all 0.4s",
							overflow: "hidden",
							"&:hover": {
								transform: "scale(1.02)",
								borderColor: theme.palette.primary.light,
								boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.3)`,
								"& .gradient-overlay": {
									opacity: 1,
								},
								"& .title": {
									color: theme.palette.primary.light,
								},
							},
						}}
					>
						<Box
							className="gradient-overlay"
							sx={{
								position: "absolute",
								inset: 0,
								background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10, ${theme.palette.tertiary?.main || theme.palette.accent?.main || theme.palette.secondary.main}10)`,
								opacity: 0,
								transition: "opacity 0.5s",
							}}
						/>
						<Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
							<Typography
								className="title"
								variant="body2"
								sx={{
									fontWeight: 600,
									color: "#fff",
									transition: "color 0.3s",
								}}
							>
								{media.title}
							</Typography>
							{entry.episodeId && (
								<Typography
									variant="caption"
									sx={{ color: "rgba(255, 255, 255, 0.6)" }}
								>
									Episode {entry.episodeId}
								</Typography>
							)}
							<Box
								sx={{
									mt: 1.5,
									height: 8,
									width: "100%",
									overflow: "hidden",
									borderRadius: "4px",
									background:
										theme.palette.glass?.light || "rgba(255, 255, 255, 0.03)",
									backdropFilter: "blur(10px)",
								}}
							>
								<Box
									sx={{
										height: "100%",
										width: `${percent}%`,
										background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										borderRadius: "4px",
										boxShadow: `0 0 10px rgba(0, 212, 255, 0.5)`,
										transition: "width 0.5s",
									}}
								/>
							</Box>
							<Typography
								variant="caption"
								sx={{ color: "rgba(255, 255, 255, 0.6)" }}
							>
								{percent}% watched
							</Typography>
						</Stack>
					</Card>
				);
			})}
		</Box>
	);
};
