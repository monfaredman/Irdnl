"use client";

import {
	Box,
	Card,
	CardContent,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { BannerAd } from "@/components/ads/BannerAd";
import { series, sidebarHighlights, trendingContent } from "@/data/mockContent";

const latestEpisodes = series[0]?.seasons[0]?.episodes.slice(0, 4) ?? [];

export const Sidebar = () => {
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
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.12)"}`,
	};

	return (
		<Box
			component="aside"
			sx={{ display: "flex", flexDirection: "column", gap: 4 }}
		>
			<Box component="section" aria-labelledby="sidebar_trending">
				<Typography
					id="sidebar_trending"
					variant="overline"
					sx={{
						fontSize: "0.875rem",
						fontWeight: 600,
						letterSpacing: "0.05em",
						color: "rgba(255, 255, 255, 0.6)",
						mb: 2,
						display: "block",
					}}
				>
					Trending
				</Typography>
				<Stack spacing={2}>
					{trendingContent.map((item) => (
						<Card
							key={item.id}
							component={Link}
							href={`/${item.type === "movie" ? "movies" : "series"}/${item.slug}`}
							sx={{
								...glassStyle,
								borderRadius: 3,
								p: 1.5,
								textDecoration: "none",
								transition: "all 0.4s",
								"&:hover": {
									transform: "scale(1.02)",
									borderColor: theme.palette.primary.light,
									boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.3)`,
									"& .title": {
										color: theme.palette.primary.light,
									},
									"& .poster": {
										transform: "scale(1.1)",
									},
								},
							}}
						>
							<Stack direction="row" spacing={2} alignItems="center">
								<Box
									sx={{
										position: "relative",
										width: 64,
										height: 64,
										borderRadius: 2,
										overflow: "hidden",
									}}
								>
									<Image
										className="poster"
										src={item.poster}
										alt={item.title}
										fill
										style={{
											objectFit: "cover",
											transition: "transform 0.5s",
										}}
									/>
								</Box>
								<Box>
									<Typography
										className="title"
										variant="body2"
										sx={{
											fontWeight: 600,
											color: "#fff",
											transition: "color 0.3s",
										}}
									>
										{item.title}
									</Typography>
									<Typography
										variant="caption"
										sx={{
											color: theme.palette.primary.light,
											fontSize: "0.75rem",
										}}
									>
										Heat score {item.heat}
									</Typography>
								</Box>
							</Stack>
						</Card>
					))}
				</Stack>
			</Box>

			<Box component="section" aria-labelledby="sidebar_episodes">
				<Typography
					id="sidebar_episodes"
					variant="overline"
					sx={{
						fontSize: "0.875rem",
						fontWeight: 600,
						letterSpacing: "0.05em",
						color: "rgba(255, 255, 255, 0.6)",
						mb: 2,
						display: "block",
					}}
				>
					New episodes
				</Typography>
				<Stack spacing={1.5}>
					{latestEpisodes.map((episode) => (
						<Card
							key={episode.id}
							component={Link}
							href={`/serie/${series[0]?.slug ?? "series"}`}
							sx={{
								...glassSubtleStyle,
								borderRadius: 3,
								px: 2,
								py: 1.5,
								textDecoration: "none",
								transition: "all 0.3s",
								"&:hover": {
									...glassStyle,
									"& .title": {
										color: theme.palette.primary.light,
									},
								},
							}}
						>
							<Stack spacing={0.5}>
								<Typography
									className="title"
									variant="body2"
									sx={{
										fontWeight: 600,
										color: "#fff",
										transition: "color 0.3s",
									}}
								>
									{episode.title}
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: "rgba(255, 255, 255, 0.6)" }}
								>
									{episode.duration} min · {episode.releaseDate}
								</Typography>
							</Stack>
						</Card>
					))}
				</Stack>
			</Box>

			<BannerAd placement="sidebar" />

			<Box component="section" aria-labelledby="sidebar_editor">
				<Typography
					id="sidebar_editor"
					variant="overline"
					sx={{
						fontSize: "0.875rem",
						fontWeight: 600,
						letterSpacing: "0.05em",
						color: "rgba(255, 255, 255, 0.6)",
						mb: 2,
						display: "block",
					}}
				>
					Editor&apos;s picks
				</Typography>
				<Stack spacing={2}>
					{sidebarHighlights.map((item) => (
						<Card
							key={item.id}
							component={Link}
							href={item.href}
							sx={{
								...glassStyle,
								borderRadius: 3,
								p: 1.5,
								textDecoration: "none",
								transition: "all 0.4s",
								"&:hover": {
									transform: "scale(1.02)",
									borderColor: theme.palette.primary.light,
									boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.3)`,
									"& .title": {
										color: theme.palette.primary.light,
									},
									"& .poster": {
										transform: "scale(1.1)",
									},
								},
							}}
						>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<Box
									sx={{
										position: "relative",
										width: 64,
										height: 64,
										borderRadius: 2,
										overflow: "hidden",
									}}
								>
									<Image
										className="poster"
										src={item.poster}
										alt={item.title}
										width={64}
										height={64}
										style={{
											objectFit: "cover",
											transition: "transform 0.5s",
										}}
									/>
								</Box>
								<Box>
									<Typography
										className="title"
										variant="body2"
										sx={{
											fontWeight: 600,
											color: "#fff",
											transition: "color 0.3s",
										}}
									>
										{item.title}
									</Typography>
									<Typography
										variant="caption"
										sx={{
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											color: "rgba(255, 255, 255, 0.5)",
											fontSize: "0.75rem",
										}}
									>
										{item.category}
									</Typography>
								</Box>
							</Stack>
						</Card>
					))}
				</Stack>
			</Box>
		</Box>
	);
};
