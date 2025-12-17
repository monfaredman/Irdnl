"use client";

import {
	Add,
	ArrowBack,
	FavoriteBorder,
	IosShare,
	Remove,
	Star,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Divider,
	IconButton,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
	glassStyles,
} from "@/theme/glass-design-system";

type ItemSpecRow = { label: string; value: string };

type ItemData = {
	id: string;
	title: string;
	subtitle?: string;
	description: string;
	price: number;
	currency: string;
	premium: boolean;
	rating?: number;
	reviewCount?: number;
	availability: "in-stock" | "preorder" | "out-of-stock";
	images: Array<{ src: string; alt: string }>;
	specs: ItemSpecRow[];
};

function formatPrice(currency: string, value: number) {
	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(value);
	} catch {
		return `${value.toFixed(0)} ${currency}`;
	}
}

function useInViewOnce<T extends Element>(options?: IntersectionObserverInit) {
	const ref = useRef<T | null>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		if (!ref.current || inView) return;

		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0];
			if (entry?.isIntersecting) {
				setInView(true);
				observer.disconnect();
			}
		}, options);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [inView, options]);

	return { ref, inView };
}

function GlassRevealSection({
	children,
	delay = 0,
}: {
	children: React.ReactNode;
	delay?: number;
}) {
	const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.12 });

	return (
		<Box
			ref={ref}
			sx={{
				transform: inView ? "translateY(0px)" : "translateY(14px)",
				opacity: inView ? 1 : 0,
				transition: `all 650ms ${glassAnimations.smooth}`,
				transitionDelay: `${delay}ms`,
			}}
		>
			{children}
		</Box>
	);
}

function LiquidBorderCard({
	children,
	premium,
}: {
	children: React.ReactNode;
	premium?: boolean;
}) {
	return (
		<Box
			sx={{
				position: "relative",
				borderRadius: glassBorderRadius.xl,
				padding: "1px",
				background: premium ? "var(--premium-gradient)" : "var(--glass-border)",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					inset: -60,
					background:
						"conic-gradient(from 180deg, rgba(245,158,11,0.0), rgba(245,158,11,0.55), rgba(255,255,255,0.10), rgba(245,158,11,0.0))",
					filter: "blur(18px)",
					animation: premium ? "liquidSpin 6s linear infinite" : "none",
					opacity: premium ? 0.85 : 0.35,
				},
				"@keyframes liquidSpin": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
			}}
		>
			<Box
				sx={{
					position: "relative",
					borderRadius: glassBorderRadius.xl,
					background: "var(--glass-bg)",
					border: "1px solid transparent",
					backdropFilter: glassBlur.medium,
					WebkitBackdropFilter: glassBlur.medium,
					boxShadow:
						"0 22px 64px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
					padding: { xs: 2.5, md: 3 },
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

function QuantitySelector({
	value,
	onChange,
	busy,
}: {
	value: number;
	onChange: (next: number) => void;
	busy?: boolean;
}) {
	const dec = () => onChange(Math.max(1, value - 1));
	const inc = () => onChange(Math.min(99, value + 1));

	return (
		<Box
			role="group"
			aria-label="Quantity selector"
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				borderRadius: glassBorderRadius.pill,
				border: "1px solid var(--glass-border)",
				background: "rgba(255,255,255,0.03)",
				px: 1,
				py: 0.5,
			}}
		>
			<IconButton
				onClick={dec}
				disabled={busy || value <= 1}
				aria-label="Decrease quantity"
				size="small"
				sx={{
					color: "rgba(255,255,255,0.85)",
					"&:disabled": { color: "rgba(255,255,255,0.35)" },
				}}
			>
				<Remove fontSize="small" />
			</IconButton>
			<Box
				aria-live="polite"
				sx={{
					minWidth: 34,
					textAlign: "center",
					color: "rgba(255,255,255,0.9)",
					fontWeight: 600,
				}}
			>
				{value}
			</Box>
			<IconButton
				onClick={inc}
				disabled={busy || value >= 99}
				aria-label="Increase quantity"
				size="small"
				sx={{
					color: "rgba(255,255,255,0.85)",
					"&:disabled": { color: "rgba(255,255,255,0.35)" },
				}}
			>
				<Add fontSize="small" />
			</IconButton>
		</Box>
	);
}

export default function ItemDetailPage() {
	const { id } = useParams<{ id: string }>();
	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

	const [data, setData] = useState<ItemData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [qty, setQty] = useState(1);
	const [adding, setAdding] = useState(false);
	const [addedPulse, setAddedPulse] = useState(false);

	const activeImg = useMemo(
		() => data?.images?.[activeImageIndex],
		[data, activeImageIndex],
	);

	const fetchItem = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/items/${encodeURIComponent(id)}`, {
				method: "GET",
				headers: { Accept: "application/json" },
				cache: "no-store",
			});

			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.message || `Request failed: ${res.status}`);
			}

			const json = (await res.json()) as ItemData;
			setData(json);
			setActiveImageIndex(0);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load item");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	const handleAddToCart = async () => {
		if (!data) return;

		setAdding(true);
		setAddedPulse(false);

		// Mock cart call. Replace with real cart API when available.
		await new Promise((r) => setTimeout(r, 650));

		setAdding(false);
		setAddedPulse(true);
		window.setTimeout(() => setAddedPulse(false), 1100);
	};

	const handleShare = async () => {
		if (typeof window === "undefined") return;

		const sharePayload = {
			title: data?.title ?? "Item",
			text: data?.subtitle ?? "",
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(sharePayload);
			} else {
				await navigator.clipboard.writeText(sharePayload.url);
			}
		} catch {
			// User canceled share; do nothing.
		}
	};

	const availabilityLabel = useMemo(() => {
		switch (data?.availability) {
			case "in-stock":
				return "In stock";
			case "preorder":
				return "Pre‑order";
			case "out-of-stock":
				return "Out of stock";
			default:
				return "";
		}
	}, [data?.availability]);

	return (
		<Box
			sx={{
				py: { xs: 12, md: 14 },
				minHeight: "100vh",
				position: "relative",
				background:
					"radial-gradient(circle at 20% 15%, rgba(245,158,11,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 25%, rgba(255,255,255,0.10) 0%, transparent 55%), radial-gradient(circle at 50% 95%, rgba(245,158,11,0.14) 0%, transparent 60%)",
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
					<IconButton
						component={Link}
						href="/"
						aria-label="Back"
						sx={{
							color: "rgba(255,255,255,0.85)",
							border: "1px solid var(--glass-border)",
							background: "rgba(255,255,255,0.03)",
						}}
					>
						<ArrowBack />
					</IconButton>
					<Typography
						sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem" }}
					>
						Home / Item
					</Typography>
				</Box>

				{error && (
					<Alert
						severity="error"
						sx={{
							mb: 3,
							borderRadius: glassBorderRadius.lg,
							background: "rgba(239,68,68,0.12)",
							border: "1px solid rgba(239,68,68,0.25)",
							color: "rgba(255,255,255,0.9)",
						}}
						action={
							<Button
								onClick={fetchItem}
								color="inherit"
								size="small"
								sx={{ textTransform: "none" }}
							>
								Retry
							</Button>
						}
					>
						{error}
					</Alert>
				)}

				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: { xs: 3, md: 4 },
						alignItems: "stretch",
					}}
				>
					{/* Left: Gallery */}
					<Box sx={{ flex: { xs: "1 1 auto", md: "0 0 58%" }, minWidth: 0 }}>
						<GlassRevealSection>
							<LiquidBorderCard premium={data?.premium}>
								<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
									<Box
										sx={{
											position: "relative",
											borderRadius: glassBorderRadius.lg,
											overflow: "hidden",
											aspectRatio: { xs: "16/10", md: "16/9" },
											border: "1px solid var(--glass-border)",
											background:
												"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
										}}
									>
										{loading ? (
											<Skeleton
												variant="rectangular"
												sx={{
													width: "100%",
													height: "100%",
													bgcolor: "rgba(255,255,255,0.06)",
												}}
											/>
										) : activeImg ? (
											<Image
												src={activeImg.src}
												alt={activeImg.alt}
												fill
												sizes={
													isMdUp ? "(max-width: 1200px) 60vw, 700px" : "100vw"
												}
												style={{ objectFit: "cover" }}
												priority
											/>
										) : (
											<Box sx={{ p: 4, color: "rgba(255,255,255,0.7)" }}>
												No image
											</Box>
										)}

										{/* Zoom hint (simple hover zoom) */}
										{!loading && activeImg && (
											<Box
												sx={{
													pointerEvents: "none",
													position: "absolute",
													inset: 0,
													opacity: 0,
													transition: glassAnimations.transition.smooth,
													background: "rgba(0,0,0,0.15)",
													"&:hover": { opacity: 1 },
												}}
											/>
										)}
									</Box>

									{/* Thumbnails */}
									<Box
										sx={{
											display: "flex",
											gap: 1.25,
											overflowX: "auto",
											pb: 0.5,
											"&::-webkit-scrollbar": { display: "none" },
										}}
										aria-label="Image thumbnails"
										role="list"
									>
										{loading
											? Array.from({ length: 4 }).map((_, idx) => (
													<Box
														key={`sk-${idx}`}
														role="listitem"
														sx={{ flex: "0 0 auto" }}
													>
														<Box
															sx={{
																width: 76,
																height: 52,
																borderRadius: glassBorderRadius.md,
																overflow: "hidden",
																position: "relative",
																border: "1px solid var(--glass-border)",
																background: "rgba(255,255,255,0.04)",
															}}
														>
															<Skeleton
																variant="rectangular"
																sx={{
																	width: "100%",
																	height: "100%",
																	bgcolor: "rgba(255,255,255,0.06)",
																}}
															/>
														</Box>
													</Box>
												))
											: (data?.images ?? []).map(
													(img: { src: string; alt: string }, idx: number) => {
														const selected = idx === activeImageIndex;
														return (
															<Box
																key={img.src}
																role="listitem"
																sx={{ flex: "0 0 auto" }}
															>
																<Box
																	component="button"
																	onClick={() => setActiveImageIndex(idx)}
																	aria-label={`View image ${idx + 1}`}
																	aria-pressed={selected}
																	style={{
																		border: "none",
																		padding: 0,
																		background: "transparent",
																		cursor: "pointer",
																	}}
																>
																	<Box
																		sx={{
																			width: 76,
																			height: 52,
																			borderRadius: glassBorderRadius.md,
																			overflow: "hidden",
																			position: "relative",
																			border: selected
																				? `1px solid ${glassColors.persianGold}`
																				: "1px solid var(--glass-border)",
																			boxShadow: selected
																				? `0 14px 28px -14px ${glassColors.gold.glow}`
																				: "none",
																			transition:
																				glassAnimations.transition.springFast,
																			transform: selected
																				? "translateY(-2px)"
																				: "translateY(0px)",
																			background: "rgba(255,255,255,0.04)",
																		}}
																	>
																		<Image
																			src={img.src}
																			alt={img.alt}
																			fill
																			sizes="76px"
																			style={{ objectFit: "cover" }}
																		/>
																	</Box>
																</Box>
															</Box>
														);
													},
												)}
									</Box>
								</Box>
							</LiquidBorderCard>
						</GlassRevealSection>
					</Box>

					{/* Right: Details */}
					<Box sx={{ flex: { xs: "1 1 auto", md: "1 1 42%" }, minWidth: 0 }}>
						<GlassRevealSection delay={90}>
							<LiquidBorderCard premium={data?.premium}>
								<Box
									sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
								>
									{/* Title + premium badge */}
									<Box
										sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
									>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography
												variant="h4"
												sx={{
													color: glassColors.text.primary,
													fontWeight: 700,
													letterSpacing: "-0.02em",
													lineHeight: 1.1,
												}}
											>
												{loading ? <Skeleton width="85%" /> : data?.title}
											</Typography>
											<Typography
												sx={{
													mt: 0.75,
													color: glassColors.text.secondary,
													fontSize: "0.975rem",
												}}
											>
												{loading ? <Skeleton width="70%" /> : data?.subtitle}
											</Typography>
										</Box>

										{!loading && data?.premium && (
											<Box
												aria-label="Premium item"
												sx={{
													flex: "0 0 auto",
													borderRadius: glassBorderRadius.pill,
													px: 1.5,
													py: 0.5,
													border: "1px solid rgba(245,158,11,0.45)",
													background: "var(--premium-gradient)",
													color: glassColors.black,
													fontWeight: 800,
													fontSize: "0.75rem",
													letterSpacing: "0.12em",
													textTransform: "uppercase",
													boxShadow: `0 10px 26px -16px ${glassColors.gold.glow}`,
												}}
											>
												Premium
											</Box>
										)}
									</Box>

									{/* Metadata */}
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											alignItems: "center",
											gap: 1.25,
										}}
									>
										{loading ? (
											<>
												<Skeleton width={120} />
												<Skeleton width={90} />
											</>
										) : (
											<>
												{typeof data?.rating === "number" && (
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
														}}
													>
														<Star
															sx={{
																color: glassColors.persianGold,
																fontSize: "1.1rem",
															}}
														/>
														<Typography
															sx={{
																color: "rgba(255,255,255,0.9)",
																fontWeight: 650,
															}}
														>
															{data.rating.toFixed(1)}
														</Typography>
														<Typography
															sx={{
																color: "rgba(255,255,255,0.55)",
																fontSize: "0.875rem",
															}}
														>
															({data.reviewCount ?? 0})
														</Typography>
													</Box>
												)}

												<Box
													sx={{
														borderRadius: glassBorderRadius.pill,
														px: 1.25,
														py: 0.35,
														border: "1px solid var(--glass-border)",
														background: "rgba(255,255,255,0.03)",
														color: "rgba(255,255,255,0.75)",
														fontSize: "0.85rem",
													}}
												>
													{availabilityLabel}
												</Box>
											</>
										)}
									</Box>

									<Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

									{/* Description */}
									<Typography
										sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}
									>
										{loading ? <Skeleton height={72} /> : data?.description}
									</Typography>

									{/* Pricing module */}
									<Box
										sx={{
											borderRadius: glassBorderRadius.lg,
											border: "1px solid var(--glass-border)",
											background:
												"linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
											p: 2,
											display: "flex",
											flexDirection: "column",
											gap: 1.25,
										}}
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												gap: 2,
											}}
										>
											<Typography
												sx={{
													color: "rgba(255,255,255,0.7)",
													fontSize: "0.9rem",
												}}
											>
												Price
											</Typography>
											<Typography
												sx={{
													color: "rgba(255,255,255,0.95)",
													fontWeight: 800,
													fontSize: "1.5rem",
													letterSpacing: "-0.02em",
												}}
											>
												{loading ? (
													<Skeleton width={110} />
													) : data ? (
														formatPrice(data.currency, data.price)
													) : (
														"—"
													)}
											</Typography>
										</Box>

										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												gap: 2,
											}}
										>
											<Typography
												sx={{
													color: "rgba(255,255,255,0.7)",
													fontSize: "0.9rem",
												}}
											>
												Quantity
											</Typography>
											<QuantitySelector
												value={qty}
												onChange={setQty}
												busy={adding || loading}
											/>
										</Box>

										<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
											<Button
												fullWidth
												onClick={handleAddToCart}
												disabled={
													loading ||
													adding ||
													data?.availability === "out-of-stock"
												}
												aria-label="Add to cart"
												sx={{
													borderRadius: glassBorderRadius.pill,
													textTransform: "none",
													fontWeight: 700,
													height: 46,
													background: "var(--premium-gradient)",
													color: glassColors.black,
													border: "1px solid rgba(255,255,255,0.18)",
													position: "relative",
													overflow: "hidden",
													transition: glassAnimations.transition.spring,
													"&:hover": {
														transform: "translateY(-2px)",
														filter: "brightness(1.05)",
													},
													"&:disabled": {
														opacity: 0.55,
														color: "rgba(0,0,0,0.55)",
													},
													"&::after": {
														content: '""',
														position: "absolute",
														left: addedPulse ? "-10%" : "-120%",
														top: 0,
														height: "100%",
														width: "45%",
														background:
															"linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
														transform: "skewX(-20deg)",
														transition: `left 900ms ${glassAnimations.spring}`,
														opacity: addedPulse ? 1 : 0,
													},
												}}
											>
												{adding ? (
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1,
														}}
													>
														<CircularProgress
															size={18}
															sx={{ color: "rgba(0,0,0,0.7)" }}
														/>
														Adding…
													</Box>
												) : (
													"Add to cart"
												)}
											</Button>

											<Tooltip title="Save" arrow>
												<IconButton
													aria-label="Save item"
													sx={{
														borderRadius: glassBorderRadius.pill,
														border: "1px solid var(--glass-border)",
														background: "rgba(255,255,255,0.03)",
														color: "rgba(255,255,255,0.9)",
														height: 46,
														width: 46,
													}}
												>
													<FavoriteBorder />
												</IconButton>
											</Tooltip>

											<Tooltip title="Share" arrow>
												<IconButton
													onClick={handleShare}
													aria-label="Share item"
													sx={{
														borderRadius: glassBorderRadius.pill,
														border: "1px solid var(--glass-border)",
														background: "rgba(255,255,255,0.03)",
														color: "rgba(255,255,255,0.9)",
														height: 46,
														width: 46,
													}}
												>
													<IosShare />
												</IconButton>
											</Tooltip>
										</Box>
									</Box>
								</Box>
							</LiquidBorderCard>
						</GlassRevealSection>

						<Box sx={{ height: 16 }} />

						{/* Specs */}
						<GlassRevealSection delay={180}>
							<Box sx={glassStyles.card}>
								<Box sx={{ p: 3 }}>
									<Typography
										sx={{
											color: glassColors.text.primary,
											fontWeight: 750,
											letterSpacing: "-0.01em",
											mb: 1.5,
											fontSize: "1.05rem",
										}}
									>
										Specifications
									</Typography>

									{loading ? (
										<Box sx={{ display: "grid", gap: 1 }}>
											{Array.from({ length: 5 }).map((_, i) => (
												<Skeleton
													key={i}
													height={28}
													sx={{
														bgcolor: "rgba(255,255,255,0.06)",
														borderRadius: glassBorderRadius.md,
													}}
												/>
											))}
										</Box>
									) : (
										<Table
											size="small"
											aria-label="Specifications"
											sx={{
												"& .MuiTableCell-root": {
													borderColor: "rgba(255,255,255,0.08)",
													color: "rgba(255,255,255,0.78)",
													px: 0,
												},
											}}
										>
											<TableBody>
												{(data?.specs ?? []).map((row) => (
													<TableRow key={row.label}>
														<TableCell
															sx={{
																fontWeight: 650,
																color: "rgba(255,255,255,0.95)",
																pr: 2,
																width: "40%",
															}}
														>
															{row.label}
														</TableCell>
														<TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
															{row.value}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									)}
								</Box>
							</Box>
						</GlassRevealSection>
					</Box>
				</Box>

				<Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
					<Typography
						sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}
					>
						Tip: try sample items <Link href="/item/1">/item/1</Link> or{" "}
						<Link href="/item/2">/item/2</Link>
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
