"use client";

import { ArrowBack } from "@mui/icons-material";
import {
	Alert,
	Box,
	CircularProgress,
	Container,
	IconButton,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";
import { contentApi } from "@/lib/api/content";

export default function WatchPage() {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<Movie | Series | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchItem = useCallback(async () => {
		if (!id) {
			setError("Invalid content ID");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const content = await contentApi.getContentById(id);
			if (!content) {
				throw new Error("Content not found");
			}
			setData(content);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load content");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
					background: glassColors.deepMidnight,
				}}
			>
				<CircularProgress
					size={60}
					sx={{
						color: glassColors.persianGold,
					}}
				/>
			</Box>
		);
	}

	if (error || !data) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: glassColors.deepMidnight,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Container maxWidth="md">
					<Alert
						severity="error"
						sx={{
							borderRadius: glassBorderRadius.lg,
							background: "rgba(239,68,68,0.12)",
							border: "1px solid rgba(239,68,68,0.25)",
							color: glassColors.text.primary,
						}}
					>
						{error || "Content not found"}
					</Alert>
					<Box sx={{ mt: 3, textAlign: "center" }}>
						<Link href={`/item/${id}`}>
							<IconButton
								sx={{
									color: glassColors.text.primary,
									background: glassColors.glass.strong,
								}}
							>
								<ArrowBack />
							</IconButton>
						</Link>
					</Box>
				</Container>
			</Box>
		);
	}

	const movie = data as Movie;
	const sources = movie.sources || [];
	const contentAccessType = (data as any).accessType || "free";

	// If this is Upera content (non-free), redirect to external URL
	if (contentAccessType !== "free") {
		if (typeof window !== "undefined" && data.externalPlayerUrl) {
			window.open(data.externalPlayerUrl, "_blank", "noopener,noreferrer");
		}
		const accessLabels: Record<string, string> = {
			subscription: "اشتراکی",
			single_purchase: "تک فروشی",
			traffic: "ترافیکی",
		};
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: glassColors.deepMidnight,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					gap: 3,
				}}
			>
				<Container maxWidth="md" sx={{ textAlign: "center" }}>
					<Alert
						severity="info"
						sx={{
							borderRadius: glassBorderRadius.lg,
							background: "rgba(59,130,246,0.12)",
							border: "1px solid rgba(59,130,246,0.25)",
							color: glassColors.text.primary,
							mb: 3,
						}}
					>
						{`این محتوا از نوع «${accessLabels[contentAccessType] || contentAccessType}» است. در حال انتقال به پلتفرم Upera...`}
					</Alert>
					{data.externalPlayerUrl && (
						<Box
							component="a"
							href={data.externalPlayerUrl}
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: 1,
								px: 3,
								py: 1.5,
								borderRadius: glassBorderRadius.md,
								background: glassColors.gold.solid,
								color: glassColors.black,
								textDecoration: "none",
								fontWeight: 600,
								fontSize: "0.875rem",
								"&:hover": { opacity: 0.9 },
							}}
						>
							رفتن به Upera
						</Box>
					)}
					<Box sx={{ mt: 2 }}>
						<Link href={`/item/${id}`}>
							<IconButton
								sx={{
									color: glassColors.text.primary,
									background: glassColors.glass.strong,
								}}
							>
								<ArrowBack />
							</IconButton>
						</Link>
					</Box>
				</Container>
			</Box>
		);
	}

	// Free content with external player URL
	if (data.externalPlayerUrl && sources.length === 0) {
		if (typeof window !== "undefined") {
			window.open(data.externalPlayerUrl, "_blank", "noopener,noreferrer");
		}
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: glassColors.deepMidnight,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					gap: 3,
				}}
			>
				<Container maxWidth="md" sx={{ textAlign: "center" }}>
					<Alert
						severity="info"
						sx={{
							borderRadius: glassBorderRadius.lg,
							background: "rgba(59,130,246,0.12)",
							border: "1px solid rgba(59,130,246,0.25)",
							color: glassColors.text.primary,
							mb: 3,
						}}
					>
						در حال انتقال به پخش‌کننده خارجی...
					</Alert>
					<Box
						component="a"
						href={data.externalPlayerUrl}
						target="_blank"
						rel="noopener noreferrer"
						sx={{
							display: "inline-flex",
							alignItems: "center",
							gap: 1,
							px: 3,
							py: 1.5,
							borderRadius: glassBorderRadius.md,
							background: glassColors.gold.solid,
							color: glassColors.black,
							textDecoration: "none",
							fontWeight: 600,
							fontSize: "0.875rem",
							"&:hover": { opacity: 0.9 },
						}}
					>
						باز کردن پخش‌کننده خارجی
					</Box>
					<Box sx={{ mt: 2 }}>
						<Link href={`/item/${id}`}>
							<IconButton
								sx={{
									color: glassColors.text.primary,
									background: glassColors.glass.strong,
								}}
							>
								<ArrowBack />
							</IconButton>
						</Link>
					</Box>
				</Container>
			</Box>
		);
	}

	if (sources.length === 0) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: glassColors.deepMidnight,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Container maxWidth="md">
					<Alert
						severity="warning"
						sx={{
							borderRadius: glassBorderRadius.lg,
							background: "rgba(251,191,36,0.12)",
							border: "1px solid rgba(251,191,36,0.25)",
							color: glassColors.text.primary,
						}}
					>
						No video sources available for this content.
					</Alert>
					<Box sx={{ mt: 3, textAlign: "center" }}>
						<Link href={`/item/${id}`}>
							<IconButton
								sx={{
									color: glassColors.text.primary,
									background: glassColors.glass.strong,
								}}
							>
								<ArrowBack />
							</IconButton>
						</Link>
					</Box>
				</Container>
			</Box>
		);
	}

	// Get the highest quality source
	const primarySource = sources[0];

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: glassColors.deepMidnight,
			}}
		>
			{/* Back Button */}
			<Box
				sx={{
					position: "fixed",
					top: 20,
					left: 20,
					zIndex: 1000,
				}}
			>
				<IconButton
					component={Link}
					href={`/item/${id}`}
					sx={{
						color: glassColors.text.primary,
						background: glassColors.glass.strong,
						backdropFilter: "blur(10px)",
						border: `1px solid ${glassColors.glass.border}`,
						"&:hover": {
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.gold.solid}`,
						},
					}}
				>
					<ArrowBack />
				</IconButton>
			</Box>

			{/* Video Player Container */}
			<Box
				sx={{
					position: "relative",
					width: "100%",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* Title */}
				<Typography
					variant="h5"
					sx={{
						color: glassColors.text.primary,
						mb: 3,
						textAlign: "center",
						px: 2,
					}}
				>
					{data.title}
				</Typography>

				{/* Video Player */}
				<Box
					sx={{
						width: "100%",
						maxWidth: "1400px",
						aspectRatio: "16/9",
						background: glassColors.black,
						borderRadius: glassBorderRadius.lg,
						overflow: "hidden",
						border: `1px solid ${glassColors.glass.border}`,
					}}
				>
					<video
						controls
						autoPlay
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
						}}
					>
						<source
							src={primarySource.url}
							type={
								(primarySource.type || primarySource.format || "").toLowerCase() === "hls"
									? "application/x-mpegURL"
									: (primarySource.type || primarySource.format || "").toLowerCase() === "dash"
										? "application/dash+xml"
										: "video/mp4"
							}
						/>
						Your browser does not support the video tag.
					</video>
				</Box>

				{/* Quality Selector */}
				{sources.length > 1 && (
					<Box
						sx={{
							mt: 2,
							display: "flex",
							gap: 1,
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						{sources.map((source, index) => (
							<Box
								key={index}
								sx={{
									px: 2,
									py: 1,
									background: glassColors.glass.mid,
									border: `1px solid ${glassColors.glass.border}`,
									borderRadius: glassBorderRadius.md,
									color: glassColors.text.secondary,
									fontSize: "0.875rem",
								}}
							>
								{source.quality}
							</Box>
						))}
					</Box>
				)}
			</Box>
		</Box>
	);
}
