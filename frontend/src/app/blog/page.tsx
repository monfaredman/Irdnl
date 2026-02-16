"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Typography,
	Chip,
	Skeleton,
	Stack,
	Avatar,
} from "@mui/material";
import {
	CalendarMonth,
	Visibility,
	FavoriteBorder,
	Person,
	Article,
	ChevronLeft,
	ChevronRight,
} from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";
import {
	glassStyles,
	glassColors,
	glassBorderRadius,
	glassAnimations,
	glassBlur,
} from "@/theme/glass-design-system";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BlogListPage() {
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [categoryFilter, setCategoryFilter] = useState("");

	useEffect(() => {
		fetchPosts();
	}, [page, categoryFilter]);

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const params: any = { page, limit: 12 };
			if (categoryFilter) params.category = categoryFilter;

			const response = await axios.get(`${API_BASE_URL}/blog`, { params });
			setPosts(response.data.posts || []);
			setTotalPages(response.data.totalPages || 1);
		} catch (error) {
			console.error("Failed to fetch posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const categories = [
		{ value: "", label: "همه" },
		{ value: "news", label: "اخبار" },
		{ value: "reviews", label: "نقد و بررسی" },
		{ value: "interviews", label: "مصاحبه" },
		{ value: "behind_scenes", label: "پشت صحنه" },
		{ value: "industry", label: "صنعت" },
		{ value: "technology", label: "تکنولوژی" },
		{ value: "opinion", label: "نظر" },
		{ value: "tutorials", label: "آموزش" },
	];

	return (
		<Box sx={{ minHeight: "100vh", py: { xs: 6, md: 10 } }}>
			<Container maxWidth="lg">
				{/* Hero Header */}
				<Box
					sx={{
						textAlign: "center",
						mb: 6,
					}}
				>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							gap: 1.5,
							mb: 2,
							px: 3,
							py: 1,
							borderRadius: glassBorderRadius.pill,
							background: glassColors.gold.lighter,
							border: `1px solid ${glassColors.gold.light}`,
						}}
					>
						<Article sx={{ color: glassColors.persianGold, fontSize: "1.2rem" }} />
						<Typography
							sx={{
								color: glassColors.persianGold,
								fontSize: "0.85rem",
								fontWeight: 600,
								letterSpacing: "0.1em",
							}}
						>
							وبلاگ
						</Typography>
					</Box>

					<Typography
						variant="h3"
						sx={{
							color: glassColors.text.primary,
							fontWeight: 700,
							fontSize: { xs: "1.75rem", md: "2.5rem" },
							mb: 1.5,
							letterSpacing: "-0.02em",
						}}
						dir="rtl"
					>
						مقالات و اخبار سینمایی
					</Typography>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "1rem",
							maxWidth: 600,
							mx: "auto",
						}}
						dir="rtl"
					>
						آخرین مقالات، اخبار و تحلیل‌های دنیای فیلم و سریال
					</Typography>
				</Box>

				{/* Category Filter */}
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 1,
						justifyContent: "center",
						mb: 5,
					}}
					dir="rtl"
				>
					{categories.map((cat) => (
						<Chip
							key={cat.value}
							label={cat.label}
							onClick={() => {
								setCategoryFilter(cat.value);
								setPage(1);
							}}
							sx={{
								px: 1,
								py: 0.5,
								borderRadius: glassBorderRadius.pill,
								fontWeight: 500,
								fontSize: "0.85rem",
								transition: glassAnimations.transition.spring,
								cursor: "pointer",
								...(categoryFilter === cat.value
									? {
											background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
											border: `1px solid ${glassColors.persianGold}`,
											color: glassColors.persianGold,
									  }
									: {
											background: glassColors.glass.mid,
											border: `1px solid ${glassColors.glass.border}`,
											color: glassColors.text.secondary,
											"&:hover": {
												background: glassColors.glass.strong,
												border: `1px solid ${glassColors.glass.strong}`,
												color: glassColors.text.primary,
											},
									  }),
							}}
						/>
					))}
				</Box>

				{/* Posts Grid */}
				{loading ? (
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							},
							gap: 3,
						}}
					>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Box key={i} sx={{ ...glassStyles.card, p: 0, overflow: "hidden" }}>
								<Skeleton variant="rectangular" height={200} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
								<Box sx={{ p: 3 }}>
									<Skeleton width="60%" sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 1 }} />
									<Skeleton width="100%" sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 0.5 }} />
									<Skeleton width="80%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
								</Box>
							</Box>
						))}
					</Box>
				) : posts.length === 0 ? (
					<Box
						sx={{
							...glassStyles.card,
							textAlign: "center",
							py: 8,
						}}
					>
						<Typography sx={{ color: glassColors.text.muted, fontSize: "1.1rem" }}>
							هیچ مقاله‌ای یافت نشد
						</Typography>
					</Box>
				) : (
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							},
							gap: 3,
							mb: 6,
						}}
					>
						{posts.map((post) => (
							<Link
								key={post.id}
								href={`/blog/${post.slug}`}
								style={{ textDecoration: "none" }}
							>
								<Box
									sx={{
										...glassStyles.cardHover,
										overflow: "hidden",
										p: 0,
										height: "100%",
										display: "flex",
										flexDirection: "column",
									}}
								>
									{/* Cover Image */}
									{post.coverImage && (
										<Box
											sx={{
												height: 200,
												overflow: "hidden",
												position: "relative",
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: 0,
													left: 0,
													right: 0,
													height: "50%",
													background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
												},
											}}
										>
											<Box
												component="img"
												src={post.coverImage}
												alt={post.title}
												sx={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
													transition: glassAnimations.transition.smooth,
												}}
											/>
										</Box>
									)}

									{/* Content */}
									<Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
										{/* Meta */}
										<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }} dir="rtl">
											<Chip
												label={categories.find((c) => c.value === post.category)?.label}
												size="small"
												sx={{
													background: glassColors.gold.lighter,
													border: `1px solid ${glassColors.gold.light}`,
													color: glassColors.persianGold,
													fontSize: "0.75rem",
													fontWeight: 600,
													height: 24,
												}}
											/>
											<Typography
												sx={{
													color: glassColors.text.muted,
													fontSize: "0.75rem",
													display: "flex",
													alignItems: "center",
													gap: 0.5,
												}}
											>
												<CalendarMonth sx={{ fontSize: "0.85rem" }} />
												{new Date(post.createdAt).toLocaleDateString("fa-IR")}
											</Typography>
										</Box>

										{/* Title */}
										<Typography
											sx={{
												color: glassColors.text.primary,
												fontWeight: 700,
												fontSize: "1.1rem",
												mb: 1,
												lineHeight: 1.5,
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}
											dir="rtl"
										>
											{post.title}
										</Typography>

										{/* Excerpt */}
										<Typography
											sx={{
												color: glassColors.text.tertiary,
												fontSize: "0.875rem",
												lineHeight: 1.6,
												mb: 2,
												flex: 1,
												display: "-webkit-box",
												WebkitLineClamp: 3,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}
											dir="rtl"
										>
											{post.excerpt}
										</Typography>

										{/* Footer */}
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												pt: 2,
												borderTop: `1px solid ${glassColors.glass.border}`,
											}}
											dir="rtl"
										>
											<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<Person sx={{ fontSize: "1rem", color: glassColors.text.muted }} />
												<Typography sx={{ color: glassColors.text.secondary, fontSize: "0.8rem" }}>
													{post.author?.name || "ناشناس"}
												</Typography>
											</Box>
											<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
												<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
													<Visibility sx={{ fontSize: "0.9rem", color: glassColors.text.muted }} />
													<Typography sx={{ color: glassColors.text.muted, fontSize: "0.75rem" }}>
														{post.viewsCount}
													</Typography>
												</Box>
												<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
													<FavoriteBorder sx={{ fontSize: "0.9rem", color: glassColors.text.muted }} />
													<Typography sx={{ color: glassColors.text.muted, fontSize: "0.75rem" }}>
														{post.likesCount}
													</Typography>
												</Box>
											</Box>
										</Box>
									</Box>
								</Box>
							</Link>
						))}
					</Box>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 2,
						}}
					>
						<Box
							component="button"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							sx={{
								...glassStyles.card,
								px: 3,
								py: 1.5,
								cursor: page === 1 ? "default" : "pointer",
								opacity: page === 1 ? 0.4 : 1,
								display: "flex",
								alignItems: "center",
								gap: 1,
								color: glassColors.text.secondary,
								fontSize: "0.875rem",
								border: `1px solid ${glassColors.glass.border}`,
								"&:hover:not(:disabled)": {
									border: `1px solid ${glassColors.glass.strong}`,
									color: glassColors.text.primary,
								},
							}}
						>
							<ChevronRight sx={{ fontSize: "1.1rem" }} />
							قبلی
						</Box>
						<Typography sx={{ color: glassColors.text.muted, fontSize: "0.875rem" }}>
							صفحه {page} از {totalPages}
						</Typography>
						<Box
							component="button"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							sx={{
								...glassStyles.card,
								px: 3,
								py: 1.5,
								cursor: page === totalPages ? "default" : "pointer",
								opacity: page === totalPages ? 0.4 : 1,
								display: "flex",
								alignItems: "center",
								gap: 1,
								color: glassColors.text.secondary,
								fontSize: "0.875rem",
								border: `1px solid ${glassColors.glass.border}`,
								"&:hover:not(:disabled)": {
									border: `1px solid ${glassColors.glass.strong}`,
									color: glassColors.text.primary,
								},
							}}
						>
							بعدی
							<ChevronLeft sx={{ fontSize: "1.1rem" }} />
						</Box>
					</Box>
				)}
			</Container>
		</Box>
	);
}
