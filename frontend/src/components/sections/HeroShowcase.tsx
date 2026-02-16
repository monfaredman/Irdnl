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
import { BannerAd } from "@/components/ads/BannerAd";
import { getFeaturedMovies, getFeaturedSeries } from "@/lib/content";

export const HeroShowcase = () => {
	const heroes = [...getFeaturedMovies(), ...getFeaturedSeries()].slice(0, 4);
	const theme = useTheme();

	const glassStrongStyle = {
		background: theme.palette.glass?.strong || "rgba(255, 255, 255, 0.12)",
		backdropFilter: "blur(30px) saturate(180%)",
		WebkitBackdropFilter: "blur(30px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.borderStrong || "rgba(255, 255, 255, 0.15)"}`,
		boxShadow:
			"0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
	};

	return (
		<Box
			component="section"
			sx={{ display: "flex", flexDirection: "column", gap: 3 }}
		>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
				{heroes.map((item, index) => {
					const href = `${"seasons" in item ? "/series" : "/movies"}/${item.slug}`;
					return (
						<Card
							key={item.id}
							component={Link}
							href={href}
							sx={{
								...glassStrongStyle,
								position: "relative",
								flex: 1,
								minWidth: 280,
								overflow: "hidden",
								borderRadius: 4,
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
									position: "absolute",
									inset: 0,
									"&::after": {
										content: '""',
										position: "absolute",
										inset: 0,
										background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10, ${theme.palette.tertiary?.main || theme.palette.secondary.main}10)`,
										opacity: 0,
										transition: "opacity 0.5s",
									},
									"&:hover::after": {
										opacity: 1,
									},
								}}
							>
								<Image
									src={item.backdrop}
									alt={item.title}
									fill
									style={{
										objectFit: "cover",
										opacity: 0.5,
										transition: "all 0.7s",
									}}
									sizes="(max-width:768px) 100vw, 45vw"
								/>
							</Box>
							<CardContent
								sx={{
									position: "relative",
									zIndex: 10,
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
									minHeight: 280,
									gap: 3,
									p: 3,
								}}
							>
								<Stack spacing={1.5}>
									<Typography
										variant="overline"
										sx={{
											fontSize: "0.75rem",
											letterSpacing: "0.4em",
											color: "rgba(255, 255, 255, 0.6)",
										}}
									>
										{"seasons" in item ? "Series" : "Movie"}
									</Typography>
									<Typography
										variant="h4"
										component="h1"
										sx={{
											fontSize: "1.875rem",
											fontWeight: 700,
											color: "#fff",
											transition: "color 0.3s",
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
											maxWidth: "36rem",
											fontSize: "0.875rem",
											lineHeight: 1.6,
											color: "rgba(255, 255, 255, 0.7)",
											display: "-webkit-box",
											WebkitLineClamp: 3,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
										}}
									>
										{item.description}
									</Typography>
								</Stack>
								<Stack direction="row" spacing={1.5} flexWrap="wrap">
									<Chip
										label={item.year}
										size="small"
										sx={{
											background:
												theme.palette.glass?.light ||
												"rgba(255, 255, 255, 0.03)",
											backdropFilter: "blur(10px)",
											border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.08)"}`,
											color: "rgba(255, 255, 255, 0.8)",
											fontSize: "0.875rem",
										}}
									/>
									<Chip
										label={item.genres.slice(0, 2).join(" · ")}
										size="small"
										sx={{
											background:
												theme.palette.glass?.light ||
												"rgba(255, 255, 255, 0.03)",
											backdropFilter: "blur(10px)",
											border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.08)"}`,
											color: "rgba(255, 255, 255, 0.8)",
											fontSize: "0.875rem",
										}}
									/>
									<Chip
										label={`${(Number(item.rating) || 0).toFixed(1)} IMDb`}
										size="small"
										sx={{
											background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
											backdropFilter: "blur(10px)",
											border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.08)"}`,
											color: theme.palette.primary.light,
											fontSize: "0.875rem",
											fontWeight: 600,
										}}
									/>
								</Stack>
							</CardContent>
						</Card>
					);
				})}
			</Box>
			<BannerAd placement="hero" />
		</Box>
	);
};
